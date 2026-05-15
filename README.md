# Amboras Storefront Template — Bold

High-contrast variant of the Amboras starter template. Vibrant red-orange accent on a clean white background.

This is one of the templates available in the "Pick a template" theme creation mode. Structurally identical to `amboras-starter-template` (same routes, same plugin slot anchors); only the visual layer differs.

Next.js storefront that connects to the shared Medusa Backend Orchestrator.

## Setup

```bash
cd storefront
cp .env.template .env.local
npm install
npm run dev
```

## Environment Variables

```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_STORE_ID=your-store-environment-id
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxx
```

These are injected automatically by the dev orchestrator during store provisioning.

## How It Works

The storefront sends `X-Store-Environment-ID` header on every Medusa API call via the JS SDK's `globalHeaders`. The Medusa Backend Orchestrator routes queries to the correct store database.
