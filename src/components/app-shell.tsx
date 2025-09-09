
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
  LogIn,
  UserCheck,
  MessageCircle,
} from "lucide-react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { BulBulWallet } from "@/components/bulbul-wallet"
import { SosButton } from "@/components/sos-button"

const visitorMenuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/chatbot", label: "Chatbot", icon: MessageCircle },
  { href: "/hotels", label: "Hotels", icon: BedDouble },
  { href: "/restaurants", label: "Restaurants", icon: UtensilsCrossed },
  { href: "/attractions", label: "Attractions", icon: Landmark },
  { href: "/settings", label: "Settings", icon: Settings },
];

const securityMenuItems = [
    { href: "/security/dashboard", label: "Dashboard", icon: UserCheck },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Do not render AppShell for login pages
  const noShellRoutes = ["/", "/security/login", "/visitor/login"];
  if (noShellRoutes.includes(pathname)) {
    return <>{children}</>
  }

  const isSecuritySection = pathname.startsWith('/security');
  const menuItems = isSecuritySection ? securityMenuItems : visitorMenuItems;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Image src="/logo.jpg" width={32} height={32} alt="BulBul logo" className="rounded-md" data-ai-hint="logo" />
            <span className="text-lg font-semibold font-headline">{isSecuritySection ? "BulBul Security" : "BulBul"}</span>
          </div>
        </SidebarHeader>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={{ children: item.label, side: "right" }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                isActive={pathname === "/"}
                tooltip={{ children: "Logout", side: "right" }}
              >
                <Link href="/">
                  <LogIn />
                  <span>Logout</span>
                </Link>
              </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            {!isSecuritySection && <SosButton />}
            {!isSecuritySection && <BulBulWallet />}
          </div>
        </header>
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
