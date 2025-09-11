
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";
import { sendSosAlert } from "@/services/visitorService";
import { io } from "socket.io-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function SosButton() {
    const { toast } = useToast();
    const { address } = useWallet(); // Assuming the wallet address can identify the user.
    const [isSending, setIsSending] = useState(false);
    const socket = io();

    useEffect(() => {
        // Clean up the socket connection when the component unmounts
        return () => {
            socket.disconnect();
        };
    }, [socket]);

    const handleSos = async () => {
        setIsSending(true);
        try {
            // In a real app, we might get more user details from a store/context
            const user = { name: "Registered Visitor", email: "user@example.com", walletAddress: address };
            await sendSosAlert(user);
            socket.emit("sos", user); // Emit the SOS event to the server
            toast({
                title: "SOS Alert Sent",
                description: "Your location and a help request have been sent to the security team.",
            });
        } catch (error) {
            console.error("SOS Error:", error);
            toast({
                title: "Failed to Send Alert",
                description: "Please try again or contact security directly.",
                variant: "destructive",
            });
        } finally {
            setIsSending(false);
        }
    };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
            <ShieldAlert className="mr-2 h-4 w-4" />
            SOS
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to send an SOS alert?</AlertDialogTitle>
          <AlertDialogDescription>
            This will immediately notify the security team with your current location and information.
            Only use this feature in a genuine emergency.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSos} disabled={isSending}>
            {isSending ? "Sending..." : "Yes, Send Alert"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
