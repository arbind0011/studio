
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  officerName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  officerId: z.string().regex(/^[A-Z0-9]{6}$/, { message: "Officer ID must be 6 alphanumeric characters." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SecurityLoginPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      officerName: "",
      officerId: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    console.log("Security Officer login data:", data);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Login Successful",
      description: "Welcome, Officer!",
    });

    setIsSubmitting(false);
    router.push('/security/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Image src="/logo.jpg" width={48} height={48} alt="BulBul logo" className="rounded-md" />
            </div>
          <CardTitle className="font-headline text-3xl">BulBul Security</CardTitle>
          <CardDescription>
            Security Officer Authentication Portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="officerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Officer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="officerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Officer ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., SEC123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full">
                  <Shield className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Authenticating..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
