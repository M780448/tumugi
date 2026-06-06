import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Weather from "./weather/Weather"
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "つむぎのお部屋",
  description: "つむぎのお部屋",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-card-border bg-card/80 backdrop-blur-md">
          <nav className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <Link
            href="/"
            className="text-center text-xl font-bold tracking-tight text-foreground transition-colors hover:text-accent sm:text-left"
            >
              つむぎのお部屋
            </Link>
 
           <ul className="flex flex-wrap items-center justify-center gap-1">
             <li>
               <Link
               href="/"
               className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-accent-bg hover:text-accent"
               >
                 Home
               </Link>
             </li>

             <li>
               <Link
                 href="/youtube"
                 className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-accent-bg hover:text-accent"
               >
                 YouTube
               </Link>
             </li>

             <li>
               <Link
               href="/twitcasting"
               className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-accent-bg hover:text-accent"
               >
                twitcas
               </Link>
             </li>

            <li className="ml-2">
              <Weather />
            </li>
           </ul>
          </nav>
        </header>

        {/* Main */}
        <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-card-border bg-card/50">
          <div className="mx-auto max-w-5xl px-6 py-6 text-center text-sm text-muted">
            <ul className="flex items-center justify-center gap-1">
              <li>
                <Link
                  href="https://x.com/mu_oooo_"
                  target="_blank"
                  className="rounded-lg px-2 py-2 text-xs font-medium text-muted transition-colors hover:bg-accent-bg hover:text-accent sm:px-4 sm:text-sm"
                >
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.threads.com/@mugyu15?igshid=NTc4MTIwNjQ2YQ%3D%3D"
                  target="_blank"
                  className="rounded-lg px-2 py-2 text-xs font-medium text-muted transition-colors hover:bg-accent-bg hover:text-accent sm:px-4 sm:text-sm"
                >
                  threads
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.instagram.com/mugyu15?igsh=ejkzODZ5dXZjcjFj&utm_source=qr"
                  target="_blank"
                  className="rounded-lg px-2 py-2 text-xs font-medium text-muted transition-colors hover:bg-accent-bg hover:text-accent sm:px-4 sm:text-sm"
                >
                  instagram
                </Link>
              </li>
              <li>
                <Link
                  href="https://fantia.jp/fanclubs/59114"
                  target="_blank"
                  className="rounded-lg px-2 py-2 text-xs font-medium text-muted transition-colors hover:bg-accent-bg hover:text-accent sm:px-4 sm:text-sm"
                >
                  Fantia
                </Link>
              </li>
              <li>
                <Link
                  href="https://tsumugyu.booth.pm/"
                  target="_blank"
                  className="rounded-lg px-2 py-2 text-xs font-medium text-muted transition-colors hover:bg-accent-bg hover:text-accent sm:px-4 sm:text-sm"
                >
                  Booth
                </Link>
              </li>
            </ul>
          <div className="mt-4 text-center text-xs text-muted/60">
            © {new Date().getFullYear()} つむぎのお部屋.
          </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
