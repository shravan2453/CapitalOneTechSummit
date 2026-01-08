#!/bin/bash
# Quick fix script for Supabase installation

echo "Installing @supabase/supabase-js..."
npm install @supabase/supabase-js

echo ""
echo "Checking if package was installed..."
if [ -d "node_modules/@supabase/supabase-js" ]; then
    echo "✅ Package installed successfully!"
else
    echo "❌ Package installation failed. Try running manually:"
    echo "   npm install @supabase/supabase-js --legacy-peer-deps"
fi

echo ""
echo "Checking .env.local file..."
if [ -f ".env.local" ]; then
    if grep -q "VITE_SUPABASE_URL" .env.local; then
        echo "✅ .env.local has correct VITE_ prefix"
    else
        echo "❌ .env.local needs to use VITE_ prefix (not NEXT_PUBLIC_)"
        echo "   Update your .env.local file to use:"
        echo "   VITE_SUPABASE_URL=..."
        echo "   VITE_SUPABASE_ANON_KEY=..."
    fi
else
    echo "⚠️  .env.local file not found. Create it with:"
    echo "   VITE_SUPABASE_URL=https://jtqcwhxjkjnwphheisbg.supabase.co"
    echo "   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
fi
