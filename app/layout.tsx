import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { AppContextProvider } from "@/components/AppContextProvider";
import SideBar from "@/components/sidebar/Sidebar";
import { EventBusContextProvider } from "@/components/EventBusContextProvider";
import { ThemeProvider } from "@/components/ThemeProvide";
import QueryClientProvider from "@/components/QueryClientProvider";

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
    <html lang="en" suppressHydrationWarning dir="ltr">
      <body className={inter.className}>
        <QueryClientProvider>
          <AppContextProvider>
            <EventBusContextProvider>
              <ThemeProvider attribute="class" defaultTheme="system">
                <div className="relative z-0 flex h-full w-full overflow-hidden">
                  <SideBar />
                  <div className="relative flex h-full max-w-full flex-1 flex-col overflow-hidden">
                    <main className="relative h-full w-full flex-1 overflow-auto transition-width">
                      {children}
                    </main>
                  </div>
                </div>
              </ThemeProvider>
            </EventBusContextProvider>
          </AppContextProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
