import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Menu, Plus, TextCursorInput } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Form Builder",
  description: "Create, manage, and collect submissions from your forms.",
  openGraph: {
    images: [
      {
        url: `card@2x.jpg`,
      },
    ],
    title: "Form Builder",
    description: "Create, manage, and collect submissions from your forms.",
    url: process.env.VERCEL_PROJECT_PRODUCTION_URL,
    siteName: "Form Builder",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: `card@2x.jpg`,
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className=" border-b">
          <div className="flex container max-w-7xl mx-auto px-4 md:py-3 py-3 flex-row gap-5 items-center justify-between ">
            <div className="w-full">
              <Link href="/" className="flex items-center gap-2">
                <TextCursorInput className="size-5" />
                <h1 className="md:text-2xl text-xl font-bold">Form Builder</h1>
              </Link>
              <p className="text-zinc-600 md:text-sm text-xs truncate">
                Create, manage, and collect submissions from your forms.
              </p>
            </div>
            <nav className="">
              <div className="md:flex hidden items-center lg:justify-end gap-2 w-full">
                <Button asChild variant="outline">
                  <Link href="/docs">View API Documentation</Link>
                </Button>
                <Button asChild>
                  <Link href="/forms/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Form
                  </Link>
                </Button>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon-lg"
                    className="md:hidden flex"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>
                      <Link href="/" className="flex items-center gap-2">
                        <TextCursorInput className="size-5" />
                        <h1 className="md:text-2xl text-xl font-bold">
                          Form Builder
                        </h1>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="px-5 flex flex-col gap-2">
                    <SheetTrigger asChild>
                      <Button asChild>
                        <Link href="/forms/new">
                          <Plus className="h-4 w-4 mr-2" />
                          Create New Form
                        </Link>
                      </Button>
                    </SheetTrigger>
                    <SheetTrigger asChild>
                      <Button asChild variant="outline">
                        <Link href="/docs">View API Documentation</Link>
                      </Button>
                    </SheetTrigger>
                  </div>
                  <SheetFooter></SheetFooter>
                </SheetContent>
              </Sheet>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
