import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "타임박싱 플래너",
  description: "엘론 머스크 스타일 타임박싱 플래너",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <main className="max-w-lg mx-auto pb-20 min-h-screen">
            {children}
          </main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
