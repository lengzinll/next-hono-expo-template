# Turborepo + Next.js Workspace

This is a monorepo built using [Turborepo](https://turbo.build/repo/docs) and [Bun](https://bun.sh/), containing multiple Next.js applications that share unified UI components and utility functions.

## Project Structure

```text
turbo-repo/
├── apps/
│   ├── admin    (Next.js App: Port 3001)
│   ├── docs     (Next.js App: Port 3002)
│   └── landing  (Next.js App: Port 3000)
├── packages/
│   ├── tsconfig (Shared strict TypeScript configurations)
│   ├── ui       (Shared Tailwind CSS + shadcn UI components)
│   └── utils    (Shared Axios, SWR, and general utility functions)
├── biome.json   (Global format & linting configuration)
├── turbo.json   (Turborepo pipeline configuration)
└── package.json
```

## Running the Project

To install dependencies:
```bash
bun install
```

To run all apps simultaneously:
```bash
bun run dev
```

To format and lint the whole codebase using Biome (takes < 20ms):
```bash
bun run check
```

---

## 🚀 How to Add a New App

You can easily scale this repository by adding new applications into the `apps/` directory and linking the local packages (`@repo/ui`, `@repo/utils`, etc.).

### Step 1: Create the Next.js App
Run the standard Next.js creation script inside the `apps/` directory:

```bash
cd apps
bunx create-next-app@latest my-new-app
```
*(When prompted: use TypeScript, Tailwind CSS, built-in App Router, and standard `src/app` directories).*

### Step 2: Configure Workspace Dependencies
Open `apps/my-new-app/package.json` and add the shared local packages under `"dependencies"` and `"devDependencies"`:

```json
{
  "dependencies": {
    "@repo/ui": "workspace:*",
    "@repo/utils": "workspace:*"
  },
  "devDependencies": {
    "@repo/tsconfig": "workspace:*"
  }
}
```

### Step 3: Link Tailwind CSS (Very Important)
Because the new app uses components from `@repo/ui` which rely on Tailwind classes, you *must* tell the new app's Tailwind compiler to scan the shared UI package.

1. **Delete** the generated `tailwind.config.ts` inside `my-new-app`.
2. **Create** a `tailwind.config.js` with the following configuration:

```javascript
/* apps/my-new-app/tailwind.config.js */
const sharedConfig = require("../../packages/ui/tailwind.config.js");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...sharedConfig,
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    // This line tells Tailwind to scan the UI package:
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};
```

### Step 4: Include Global Styles
In your new app's root layout file (`apps/my-new-app/src/app/layout.tsx`), replace the standard global CSS import with the shared styled imported from `@repo/ui`.

Change:
`import "./globals.css";`

To:
`import "@repo/ui/styles.css";`

### Step 5: Transpile the Local Packages
Next.js needs to know that these packages are part of the monorepo and require transpilation via Webpack/Turbopack. 

Update your `apps/my-new-app/next.config.js` (or `.mjs`):
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/utils"],
};

export default nextConfig;
```

### Step 6: Fix TypeScript Config (Optional but highly recommended)
To ensure TypeScript plays nicely with the rest of the monorepo, update `apps/my-new-app/tsconfig.json` to extend the shared config:

```json
{
  "extends": "../../packages/tsconfig/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "jsx": "preserve",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Step 7: Run Install
Return to the root of the project and reinstall to link the workspaces:

```bash
cd ../../ 
bun install
```

You can now start `bun dev`. Your new app will boot up alongside the others and have full access to `<Button />`, `<Card />` and the `apiClient`!
# next-hono-expo-template
