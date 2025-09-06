"use client";

import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function BulbulWallet() {
    const { toast } = useToast();

    const handleConnect = () => {
        toast({
            title: "Feature not available",
            description: "Blockchain wallet integration is coming soon!",
            variant: "default",
        })
    }
  return (
    <Button variant="outline" size="sm" onClick={handleConnect}>
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  );
}
