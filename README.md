# Tax Invoice App

An Australian tax invoice generator built with Next.js, TypeScript, Tailwind CSS, Supabase and Vercel.

## Local development

Requirements: Node.js 20.9+ and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>.

The app can run before Supabase is connected. After creating a Supabase project, replace the placeholder values in `.env.local` with the project's URL and publishable key.

## Commands

```bash
npm run dev       # local development server
npm run lint      # ESLint
npm run typecheck # TypeScript checks
npm run build     # production build
```

## Supabase

The repository includes Supabase CLI configuration in `supabase/config.toml`. Once a hosted project exists:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
```

Do not commit `.env.local` or expose the service-role key to browser code.
