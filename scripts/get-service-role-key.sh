#!/bin/bash

# Script to get the service role key from local Supabase instance
# This helps developers set up their .env file securely

echo "🔧 Getting Supabase service role key for local development..."
echo ""

# Check if Supabase is running
if ! supabase status > /dev/null 2>&1; then
    echo "❌ Supabase is not running. Please start it first:"
    echo "   supabase start"
    exit 1
fi

# Get the service role key
echo "📋 Supabase status:"
supabase status

echo ""
echo "🔑 Service Role Key (add to your .env file as VITE_SUPABASE_SERVICE_ROLE_KEY):"
echo ""

# Extract the service role key from supabase status
SERVICE_ROLE_KEY=$(supabase status --output json | grep -o '"service_role_key":"[^"]*"' | cut -d'"' -f4)

if [ -n "$SERVICE_ROLE_KEY" ]; then
    echo "$SERVICE_ROLE_KEY"
    echo ""
    echo "✅ Copy this key to your .env file:"
    echo "   VITE_SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY"
else
    echo "❌ Could not extract service role key from supabase status"
    echo "   Please check the output above and copy the service_role_key manually"
fi

echo ""
echo "📝 Remember: Never commit your .env file to git!"
echo "   It's already in .gitignore for security."
