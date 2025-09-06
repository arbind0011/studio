
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Wallet } from "lucide-react";
import Image from "next/image";
import { submitVisitorData } from "./actions";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  aadhar: z.string().regex(/^[0-9]{12}$/, { message: "Aadhar number must be 12 digits." }),
  phone: z.string().regex(/^[0-9]{10}$/, { message: "Phone number must be 10 digits." }),
  address: z.string().min(10, { message: "Address must be at least 10 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      aadhar: "",
      phone: "",
      address: "",
      email: "",
    },
  });

  const handleConnectWallet = () => {
    toast({
        title: "Feature not available",
        description: "Blockchain wallet integration is coming soon!",
    });
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    
    const result = await submitVisitorData(data);

    if (result.error) {
        toast({
            title: "Submission Failed",
            description: result.error,
            variant: "destructive",
        });
        setIsSubmitting(false);
    } else {
        toast({
            title: "Registration Submitted",
            description: "Your information has been submitted for verification.",
        });
        router.push('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Image src="/logo.jpg" width={48} height={48} alt="Bulbul logo" className="rounded-md" />
            </div>
          <CardTitle className="font-headline text-3xl">Bulbul</CardTitle>
          <CardDescription>
            Create your secure digital identity with Bulbul.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="e.g., john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="aadhar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aadhar Number</FormLabel>
                      <FormControl>
                        <Input placeholder="12-digit number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="10-digit number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter your full postal address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              
              <div className="flex flex-col sm:flex-row gap-4">
                  <Button type="button" variant="outline" onClick={handleConnectWallet} className="flex-1">
                      <Wallet className="mr-2 h-4 w-4" />
                      Connect Wallet
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                      {isSubmitting ? "Submitting..." : "Submit for Verification"}
                  </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
