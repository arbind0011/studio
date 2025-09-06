
"use client";

import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, UserCheck } from "lucide-react";

// Mock data for visitor logs
const visitorLogs = [
  { id: 1, name: "John Doe", aadhar: "XXXX-XXXX-1234", lastSeen: "2024-07-30 10:45 AM", status: "Online", location: "Main Lobby" },
  { id: 2, name: "Jane Smith", aadhar: "XXXX-XXXX-5678", lastSeen: "2024-07-30 11:15 AM", status: "Online", location: "Cafe" },
  { id: 3, name: "Peter Jones", aadhar: "XXXX-XXXX-9012", lastSeen: "2024-07-29 08:30 PM", status: "Offline", location: "Exited" },
  { id: 4, name: "Mary Johnson", aadhar: "XXXX-XXXX-3456", lastSeen: "2024-07-30 11:30 AM", status: "Online", location: "Attraction Area A" },
  { id: 5, name: "Chris Lee", aadhar: "XXXX-XXXX-7890", lastSeen: "2024-07-30 09:00 AM", status: "Offline", location: "Hotel Room 301" },
];

export default function SecurityDashboardPage() {
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
                  <TableHead>Last Seen</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Known Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visitorLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.name}</TableCell>
                    <TableCell>{log.lastSeen}</TableCell>
                    <TableCell>
                      <Badge variant={log.status === 'Online' ? 'default' : 'secondary'} className={log.status === 'Online' ? 'bg-green-500' : ''}>
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
