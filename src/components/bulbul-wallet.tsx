
"use client";

import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function BulBulWallet() {
    const { toast } = useToast();
    const { isConnected, balance, address, connectWallet, disconnectWallet } = useWallet();

    const handleConnect = () => {
        // In a real app, this would trigger a wallet connection flow (e.g., MetaMask)
        connectWallet();
        toast({
            title: "Wallet Connected",
            description: "Your wallet has been successfully connected.",
        });
    };

    const handleDisconnect = () => {
        disconnectWallet();
        toast({
            title: "Wallet Disconnected",
            description: "Your wallet has been disconnected.",
        });
    }

    if (!isConnected) {
        return (
            <Button variant="outline" size="sm" onClick={handleConnect}>
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    <Wallet className="mr-2 h-4 w-4" />
                    <span>{balance.toFixed(4)} ETH</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    <p className="font-medium text-foreground truncate">{address}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDisconnect}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Disconnect</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
