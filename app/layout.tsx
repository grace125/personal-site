import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideNav from '@/app/ui/sidenav';
import { courierPrime } from "./ui/fonts";
import "katex";

export const metadata: Metadata = {
  title: {
    template: "%s | Grace Schorno",
    default: "Grace Schorno Website"
  },
  description: "A website for Grace Schorno, by Grace Schorno",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TODO: style scrollbar
  return (
    <html
      lang="en"
      className={`antialiased h-full overflow-clip`}
    >
      <body className={`h-full overflow-clip flex flex-col ${courierPrime.className}`}>
        <div className="h-full block overflow-y-auto overflow-x-clip lg:scrollbar-auto scroll-smooth lg:scroll-auto bg-local w-full">
          <div className="relative min-h-full w-full flex flex-col lg:flex-row text-xl">
            <div className="grow not-lg:flex not-lg:justify-center m-4">
              <SideNav />
            </div>
            <div className="shrink pb-6 lg:pt-4 max-w-[60ch] mx-auto my-0 max-h-full">
              {children}
            </div>
            <div className="w-full grow shrink-1000000 lg:w-80"></div>
          </div>
        </div>
      </body>
    </html>
  );
}