
import { create } from 'zustand';

interface WalletState {
  isConnected: boolean;
  address: string;
  balance: number;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

// In a real app, you'd use a library like ethers.js or web3.js
// to interact with a real blockchain wallet (e.g., MetaMask).
// For this simulation, we'll just generate a fake address and balance.

const generateRandomAddress = () => {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
        address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
};

const generateRandomBalance = () => {
    return Math.random() * 10; // Random balance between 0 and 10 ETH
}

export const useWallet = create<WalletState>((set) => ({
  isConnected: false,
  address: '',
  balance: 0,
  connectWallet: () => set({ 
    isConnected: true, 
    address: generateRandomAddress(),
    balance: generateRandomBalance()
  }),
  disconnectWallet: () => set({ 
    isConnected: false, 
    address: '',
    balance: 0
  }),
}));
