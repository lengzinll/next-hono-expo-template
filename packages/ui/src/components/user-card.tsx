"use client";

import { fetcher } from "@repo/utils";
import { Building, Globe, Mail, User } from "lucide-react";
import useSWR from "swr";
import { Badge } from "./badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";

interface UserData {
  id: number;
  name: string;
  email: string;
  website: string;
  company: {
    name: string;
  };
}

export function UserFetcherCard({ userId = 1 }: { userId?: number }) {
  const { data, error, isLoading } = useSWR<UserData>(`/users/${userId}`, fetcher);

  if (isLoading) {
    return (
      <Card className="w-full max-w-sm animate-pulse">
        <CardHeader>
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="w-full max-w-sm border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to Load User</CardTitle>
          <CardDescription>Error fetching data using Axios + SWR</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm shadow-md transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-primary" />
            {data.name}
          </CardTitle>
          <Badge variant="secondary">User #{data.id}</Badge>
        </div>
        <CardDescription className="flex items-center gap-1">
          <Mail className="h-3.5 w-3.5" />
          {data.email}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Globe className="h-4 w-4" />
          <span>{data.website}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Building className="h-4 w-4" />
          <span>{data.company.name}</span>
        </div>
      </CardContent>
    </Card>
  );
}
