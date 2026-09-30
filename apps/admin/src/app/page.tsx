import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  UserFetcherCard,
} from "@repo/ui";
import { LayoutDashboard, Search, Settings, Users } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="min-h-screen space-y-6 bg-slate-100 p-8 dark:bg-slate-900">
      <header className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Admin Portal</h1>
          <Badge variant="outline">v1.0</Badge>
        </div>
        <div className="flex w-72 items-center gap-3">
          <Input placeholder="Search system..." aria-label="Search system" />
          <Button variant="secondary" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <Users className="h-5 w-5 text-blue-500" /> User Management Overview
            </CardTitle>
            <CardDescription>
              User details dynamically loaded using shared SWR fetcher utility
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UserFetcherCard userId={1} />
            <UserFetcherCard userId={2} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-slate-500" /> System Settings
            </CardTitle>
            <CardDescription>Actions using shared shadcn UI controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="api-gateway"
                className="text-xs font-semibold uppercase text-muted-foreground"
              >
                API Gateway
              </label>
              <Input id="api-gateway" defaultValue="https://jsonplaceholder.typicode.com" />
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="default">Save Configuration</Button>
              <Button variant="outline">Clear Cache</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
