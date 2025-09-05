"use client"

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  LayoutGrid,
  BedDouble,
  UtensilsCrossed,
  Landmark,
  Settings,
} from "lucide-react"
import { Logo } from "@/components/icons"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { BlockchainId } from "@/components/blockchain-id"

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/hotels", label: "Hotels", icon: BedDouble },
  { href: "/restaurants", label: "Restaurants", icon: UtensilsCrossed },
  { href: "/attractions", label: "Attractions", icon: Landmark },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Logo className="w-8 h-8 text-primary" />
            <span className="text-lg font-semibold font-headline">RoamFree</span>
          </div>
        </SidebarHeader>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, side: "right" }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b">
          <SidebarTrigger />
          <BlockchainId />
        </header>
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
