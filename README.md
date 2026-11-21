# Barcode Inventory System

A barcode inventory system with a Next.js frontend and an Express/PostgreSQL API for local development. The root route is the login page; role-aware navigation and server-enforced API permissions protect inventory, administration, and reporting features.

See [PROJECT-FEATURES.md](./PROJECT-FEATURES.md) for the complete feature brief, roles, workflows, sample data, deliverables, and implementation status.

The endpoint contract is documented in the backend's [API design](../barcode-inventory-backend/API-DESIGN.md) and machine-readable [OpenAPI specification](../barcode-inventory-backend/openapi.json).

## Development

Follow the backend [setup guide](../barcode-inventory-backend/README.md) to create the database and schema. Existing legacy users and roles are imported without changing their source credentials. On a fresh database, configure bootstrap Admin credentials in the backend environment; the project does not ship with default credentials. Then configure the frontend API proxy and start the frontend:

```bash
npm install
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) to sign in. Public registration creates read-only Report Viewer accounts; Admins create accounts for operational roles.

