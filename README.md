# Barcode Inventory System

A barcode inventory system with a Next.js frontend and an Express/PostgreSQL API for local development. The dashboard, inventory actions, catalog administration, and reports connect to the backend without login.

See [PROJECT-FEATURES.md](./PROJECT-FEATURES.md) for the complete feature brief, roles, workflows, sample data, deliverables, and implementation status.

The endpoint contract is documented in the backend's [API design](../barcode-inventory-backend/API-DESIGN.md) and machine-readable [OpenAPI specification](../barcode-inventory-backend/openapi.json).

## Development

Follow the backend [setup guide](../barcode-inventory-backend/README.md) to create the database and schema. This no-auth setup is for local development only and must not be exposed to a network. Then configure the frontend API URL and start the frontend:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

