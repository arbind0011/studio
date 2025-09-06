
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Shield } from "lucide-react";
import Image from "next/image";

export default function RoleSelectionPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Image src="/logo.jpg" width={48} height={48} alt="BulBul logo" className="rounded-md" data-ai-hint="logo" />
          </div>
          <CardTitle className="font-headline text-3xl">Welcome to BulBul</CardTitle>
          <CardDescription>
            Please select your role to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-6">
          <Button size="lg" onClick={() => router.push('/visitor/login')}>
            <User className="mr-2" />
            Visitor Login
          </Button>
          <Button size="lg" variant="outline" onClick={() => router.push('/security/login')}>
            <Shield className="mr-2" />
            Security Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
