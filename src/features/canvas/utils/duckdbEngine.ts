// DuckDB-WASM file query engine (Data Source Phase 2 — file origin).
//
// Lets a Source Node run count.co-style SQL over an uploaded CSV/Parquet file,
// entirely in the browser (no server, no credentials). The uploaded file is
// exposed to SQL as a view named `data`, so queries read like:
//   select period, value from data order by period
//
// DuckDB is heavy (multi-MB WASM); everything here is behind a dynamic import so
// it only loads the first time a user actually queries a file. The WASM/worker
// bundles are pulled from jsDelivr at runtime, so they never enter our build.

let dbPromise: Promise<any> | null = null;

async function getDb(): Promise<any> {
  if (dbPromise) return dbPromise;
  dbPromise = (async () => {
    const duckdb = await import('@duckdb/duckdb-wasm');
    const bundles = duckdb.getJsDelivrBundles();
    const bundle = await duckdb.selectBundle(bundles);
    const workerUrl = URL.createObjectURL(
      new Blob([`importScripts("${bundle.mainWorker}");`], {
        type: 'text/javascript',
      })
    );
    const worker = new Worker(workerUrl);
    const logger = new duckdb.ConsoleLogger(duckdb.LogLevel.WARNING);
    const db = new duckdb.AsyncDuckDB(logger, worker);
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker ?? undefined);
    URL.revokeObjectURL(workerUrl);
    return db;
  })();
  return dbPromise;
}

// Arrow rows can carry BigInt (integer columns); JSON-stringify chokes on those.
// Coerce to a plain JS object with numbers/strings the contract can consume.
function normalizeRow(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    out[key] = typeof value === 'bigint' ? Number(value) : value;
  }
  return out;
}

/**
 * Register an uploaded file as the `data` view and run the caller's SQL against
 * it. Returns plain rows. CSV is read with `read_csv_auto`, Parquet with
 * `read_parquet`; extension decides.
 */
export async function queryFile(
  file: File,
  sql: string
): Promise<Record<string, unknown>[]> {
  const db = await getDb();
  const buffer = new Uint8Array(await file.arrayBuffer());
  await db.registerFileBuffer(file.name, buffer);

  const conn = await db.connect();
  try {
    const reader = /\.parquet$/i.test(file.name)
      ? `read_parquet('${file.name}')`
      : `read_csv_auto('${file.name}')`;
    await conn.query(`CREATE OR REPLACE VIEW data AS SELECT * FROM ${reader}`);
    const result = await conn.query(sql);
    return result.toArray().map((r: any) => normalizeRow(r.toJSON()));
  } finally {
    await conn.close();
  }
}
