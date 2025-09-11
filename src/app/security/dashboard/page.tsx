
"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, UserCheck, ShieldAlert } from "lucide-react";
import { VisitorLog, subscribeToVisitorLogs, SosAlert } from "@/services/visitorService";
import { formatDistanceToNow } from "date-fns";
import { io } from "socket.io-client";

export default function SecurityDashboardPage() {
  const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>([]);
  const [sosAlerts, setSosAlerts] = useState<SosAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubVisitors = subscribeToVisitorLogs((logs) => {
      setVisitorLogs(logs);
      setLoading(false);
    });

    const socket = io();

    socket.on("sos", (data) => {
        const newAlert: SosAlert = {
            id: new Date().toISOString(), // Generate a unique ID for the alert
            name: data.name,
            message: "SOS button pressed",
            walletAddress: data.walletAddress,
            timestamp: new Date(),
        };
        setSosAlerts((prevAlerts) => [newAlert, ...prevAlerts]);
    });

    return () => {
        unsubVisitors();
        socket.disconnect();
    };
  }, []);

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

        <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2 text-destructive">
                    <ShieldAlert />
                    SOS Alerts
                </CardTitle>
                <CardDescription>
                    Immediate action required for these emergency alerts.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Time</TableHead>
                            <TableHead>Visitor Name</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Wallet Address</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sosAlerts.length > 0 ? (
                            sosAlerts.map((alert) => (
                                <TableRow key={alert.id} className="bg-destructive/10">
                                    <TableCell>{alert.timestamp ? formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true }) : 'N/A'}</TableCell>
                                    <TableCell className="font-medium">{alert.name}</TableCell>
                                    <TableCell>{alert.message}</TableCell>
                                    <TableCell className="font-mono text-xs">{alert.walletAddress}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No active SOS alerts.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

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
