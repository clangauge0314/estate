import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import ChannelTalk from "@/components/ChannelTalk";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from '@clerk/localizations'
import { Toaster } from "sonner";

export const metadata = {
  title: '모르면 손해',
  description: '모르면 손해 앱입니다',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider localization={koKR}>
      <html lang="ko" suppressHydrationWarning>
        <body className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Toaster position="bottom-center" richColors />
          <ChannelTalk/>
        </body>
      </html>
    </ClerkProvider>
  );
}
