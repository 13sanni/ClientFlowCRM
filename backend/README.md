# ClientFlow CRM Backend

Express API for the ClientFlow CRM project.

## Scripts

- `npm run dev` starts the TypeScript API with tsx watch.
- `npm run build` compiles TypeScript to `dist`.
- `npm start` starts the compiled API with Node.
- `npm run typecheck` checks TypeScript without emitting files.
- `npm run prisma:generate` generates Prisma client.
- `npm run prisma:migrate` runs a Prisma migration.
- `npm run prisma:studio` opens Prisma Studio.

## Setup

1. Copy `.env.example` to `.env`.
2. Update `DATABASE_URL`, JWT secrets, Redis, and SMTP values.
3. Run `npm install`.
4. Run `npm run dev`.
