
"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, UserCheck } from "lucide-react";
import { VisitorLog, subscribeToVisitorLogs } from "@/services/visitorService";
import { formatDistanceToNow } from "date-fns";

export default function SecurityDashboardPage() {
  const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // The 'unsub' function is returned by subscribeToVisitorLogs
    const unsubscribe = subscribeToVisitorLogs((logs) => {
      setVisitorLogs(logs);
      setLoading(false);
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <AppShell>
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Security Dashboard</h1>
            <p className="text-muted-foreground">Live visitor activity and system logs.</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
            <ShieldCheck className="w-5 h-5"/>
            <span>System Secure</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <UserCheck />
              Visitor Logs
            </CardTitle>
            <CardDescription>
              Real-time tracking of visitor status and location.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visitor Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            Loading visitor logs...
                        </TableCell>
                    </TableRow>
                ) : visitorLogs.length > 0 ? (
                  visitorLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.name}</TableCell>
                      <TableCell>{log.email}</TableCell>
                      <TableCell>{log.lastSeen ? formatDistanceToNow(log.lastSeen.toDate(), { addSuffix: true }) : 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={log.status === 'Online' ? 'default' : 'secondary'} className={log.status === 'Online' ? 'bg-green-500' : ''}>
                          {log.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            No visitor logs to display.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
