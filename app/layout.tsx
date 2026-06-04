import type { Metadata } from "next"
import { Noto_Sans_Thai } from "next/font/google"
import "./globals.css"

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-noto-sans-thai",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Performia",
    template: "%s — Performia",
  },
  description: "PERFORM-6™ employee wellness & performance platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className={`${notoSansThai.variable} h-full antialiased`}>
      <body className="min-h-full bg-bg-page text-text-primary">{children}</body>
    </html>
  )
}
