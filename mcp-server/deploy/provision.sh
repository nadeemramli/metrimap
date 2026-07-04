#!/usr/bin/env bash
# Provision a Hetzner Cloud VPS for the Metrimap MCP server (idempotent).
# Reads ~/.metrimap-deploy.env (git-ignored): HCLOUD_TOKEN required.
# Creates an SSH key (kept on THIS machine so you retain access) + a server with
# cloud-init (Docker + firewall). Prints the server IP for your DNS record.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="${DEPLOY_ENV:-$HOME/.metrimap-deploy.env}"
[ -f "$ENV_FILE" ] || { echo "❌ Missing $ENV_FILE (see mcp-server/deploy/README.md)"; exit 1; }
set -a; . "$ENV_FILE"; set +a
: "${HCLOUD_TOKEN:?set HCLOUD_TOKEN in $ENV_FILE}"

SERVER_NAME="${SERVER_NAME:-metrimap-mcp}"
SERVER_TYPE="${SERVER_TYPE:-cpx22}"    # 2 vCPU / 4 GB. cpx12 = 1/2 (cheaper).
LOCATION="${LOCATION:-sin}"            # Singapore (x86 cpx/ccx only). nbg1/ash also fine.
IMAGE="${IMAGE:-ubuntu-24.04}"
KEY_PATH="${KEY_PATH:-$HOME/.ssh/metrimap_mcp}"
API="https://api.hetzner.cloud/v1"

# NB: no -f — we want error bodies so failures are legible.
hc() { curl -sS -H "Authorization: Bearer $HCLOUD_TOKEN" -H "Content-Type: application/json" "$@"; }
jget() { python3 -c "import sys,json;d=json.load(sys.stdin);print($1)"; }
jstr() { python3 -c 'import json,sys;print(json.dumps(sys.argv[1]))' "$1"; }

# 1) SSH key (generate locally if absent; upload to Hetzner if not there).
if [ ! -f "$KEY_PATH" ]; then
  mkdir -p "$(dirname "$KEY_PATH")"
  ssh-keygen -t ed25519 -N '' -f "$KEY_PATH" -C "metrimap-mcp" >/dev/null
  echo "🔑 Generated SSH key at $KEY_PATH (keep it — it's your server access)."
fi
PUB="$(cat "$KEY_PATH.pub")"
key_id="$(hc "$API/ssh_keys?name=$SERVER_NAME" | jget 'd["ssh_keys"][0]["id"] if d.get("ssh_keys") else ""')"
if [ -z "$key_id" ]; then
  key_id="$(hc -X POST "$API/ssh_keys" -d "{\"name\":\"$SERVER_NAME\",\"public_key\":$(jstr "$PUB")}" | jget 'd["ssh_key"]["id"]')"
  echo "🔑 Uploaded SSH key to Hetzner (id $key_id)."
fi

# 2) Server (create if absent).
sid="$(hc "$API/servers?name=$SERVER_NAME" | jget 'd["servers"][0]["id"] if d.get("servers") else ""')"
if [ -z "$sid" ]; then
  echo "Creating $SERVER_NAME ($SERVER_TYPE @ $LOCATION, $IMAGE)…"
  USER_DATA="$(jstr "$(cat "$HERE/cloud-init.yaml")")"
  body="{\"name\":\"$SERVER_NAME\",\"server_type\":\"$SERVER_TYPE\",\"image\":\"$IMAGE\",\"location\":\"$LOCATION\",\"ssh_keys\":[$key_id],\"user_data\":$USER_DATA}"
  resp="$(hc -X POST "$API/servers" -d "$body")"
  sid="$(printf '%s' "$resp" | jget 'd.get("server",{}).get("id","")' 2>/dev/null || true)"
  if [ -z "$sid" ]; then
    echo "❌ Server create failed. Hetzner said:"
    printf '%s\n' "$resp" | python3 -m json.tool 2>/dev/null || printf '%s\n' "$resp"
    exit 1
  fi
  echo "🖥  Server created (id $sid). Waiting for it to boot…"
fi

# 3) Wait for a public IP + running status.
ip=""
for _ in $(seq 1 60); do
  line="$(hc "$API/servers/$sid" | jget 'd["server"]["status"]+"|"+((d["server"]["public_net"]["ipv4"] or {}).get("ip","") if d["server"].get("public_net") else "")')"
  status="${line%%|*}"; ip="${line#*|}"
  [ "$status" = "running" ] && [ -n "$ip" ] && break
  sleep 5
done
[ -n "$ip" ] || { echo "❌ No IP yet — check the Hetzner console."; exit 1; }

echo
echo "✅ Server up: $SERVER_NAME ($SERVER_TYPE @ $LOCATION)"
echo "   IP:  $ip"
echo "   SSH: ssh -i $KEY_PATH root@$ip"
echo
echo "Next: add DNS  →  ${MCP_DOMAIN:-mcp.canvasm.app}  A  $ip"
echo "SERVER_IP=$ip" > "$HERE/.last-ip"
