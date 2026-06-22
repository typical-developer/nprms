import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { UserProvider } from "@/lib/user-context"
import { CaseProvider } from "@/lib/case-context"
import { NotificationProvider } from "@/lib/notification-context"
import { SettingsProvider } from "@/lib/settings-context"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NPRMS - Nigeria Police Records Management System",
  description: "Role-based case management platform for police stations",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <UserProvider>
            <CaseProvider>
              <NotificationProvider>
                <SettingsProvider>
                  <ThemeProvider defaultTheme="light" storageKey="nprms-theme">
                    {children}
                  </ThemeProvider>
                </SettingsProvider>
              </NotificationProvider>
            </CaseProvider>
          </UserProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
