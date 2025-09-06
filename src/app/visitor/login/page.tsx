
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
import { useWallet } from "@/hooks/use-wallet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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
  const { connectWallet, isConnected, address } = useWallet();
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);

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
    setWalletModalOpen(true);
    // Simulate connection
    setTimeout(() => {
        connectWallet();
        setWalletModalOpen(false);
        toast({
            title: "Wallet Connected",
            description: `Connected with address: ${address.slice(0, 6)}...${address.slice(-4)}`,
        });
    }, 1500);
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    const result = await submitVisitorData(data);
    setIsSubmitting(false);

    if (result.error) {
        toast({
            title: "Submission Failed",
            description: result.error,
            variant: "destructive",
        });
    } else {
        toast({
            title: "Registration Submitted",
            description: "Your information has been processed. Redirecting now...",
        });
        router.push('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Dialog open={isWalletModalOpen} onOpenChange={setWalletModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connecting to Wallet</DialogTitle>
            <DialogDescription>
                Please wait while we securely connect to your blockchain wallet. Approve the connection in your wallet provider.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
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
                  <Button type="button" variant="outline" onClick={handleConnectWallet} className="flex-1" disabled={isConnected}>
                      <Wallet className="mr-2 h-4 w-4" />
                      {isConnected ? "Wallet Connected" : "Connect Wallet"}
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
