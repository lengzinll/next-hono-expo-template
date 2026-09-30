import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  UserFetcherCard,
} from "@repo/ui";
import { BookOpen, Code2, Cpu, Layers } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 max-w-5xl mx-auto space-y-8">
      <header className="border-b pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold">Monorepo Documentation</h1>
          <Badge variant="secondary">Bun + Turborepo</Badge>
        </div>
        <p className="text-muted-foreground text-lg">
          Reference guide for shared utilities, shadcn components, and data-fetching patterns.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Layers className="h-5 w-5 text-indigo-500" /> Shared Packages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">@repo/ui:</strong> React + shadcn UI components
              styled with Tailwind CSS.
            </p>
            <p>
              <strong className="text-foreground">@repo/utils:</strong> Helper utilities (cn, Axios
              instance, SWR fetchers).
            </p>
            <p>
              <strong className="text-foreground">@repo/tsconfig:</strong> Shared TypeScript
              configurations.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Cpu className="h-5 w-5 text-emerald-500" /> Tech Stack
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Package Manager:</strong> Bun
            </p>
            <p>
              <strong className="text-foreground">Framework:</strong> Next.js 14 (App Router)
            </p>
            <p>
              <strong className="text-foreground">Data Fetching:</strong> SWR + Axios
            </p>
            <p>
              <strong className="text-foreground">Styling:</strong> Tailwind CSS + shadcn
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Code2 className="h-5 w-5 text-blue-500" /> Monorepo Apps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Landing:</strong> Running on port 3000
            </p>
            <p>
              <strong className="text-foreground">Admin:</strong> Running on port 3001
            </p>
            <p>
              <strong className="text-foreground">Docs:</strong> Running on port 3002
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4 pt-4">
        <h2 className="text-xl font-bold">Component Showcase: UserFetcherCard</h2>
        <p className="text-sm text-muted-foreground">
          Below is a demo of{" "}
          <code className="text-xs bg-slate-200 dark:bg-slate-800 p-1 rounded">
            UserFetcherCard
          </code>{" "}
          from <code className="text-xs bg-slate-200 dark:bg-slate-800 p-1 rounded">@repo/ui</code>{" "}
          which fetches data using Axios &amp; SWR:
        </p>
        <UserFetcherCard userId={3} />
      </section>
    </div>
  );
}
