import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/components/AppContextProvider";
import SideBar from "@/components/sidebar/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Z-Ai-Chat",
  description: "possibly a clone of GPT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" dir="ltr">
      <AppContextProvider>
        <body className={inter.className}>
          <div className="relative z-0 flex h-full w-full overflow-hidden">
            <SideBar></SideBar>
            <div className="relative flex h-full max-w-full flex-1 flex-col overflow-hidden">
              <main className="relative h-full w-full flex-1 overflow-auto transition-width">{children}</main>
            </div>
          </div>
        </body>
      </AppContextProvider>
    </html>
  );
}
