// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "JBNU Departments Archive",
  description:
    "전북대학교 인문대학, 자연과학대학, 농생명대학 자료보관소 프로젝트",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-violet-700 hover:text-violet-900"
          >
            JBNU Archive
          </Link>
          {/* 우측 상단 네비게이션 제거 
          <nav className="flex gap-4">
            <Link
              href="/departments/humanities"
              className="text-sm text-blue-600 hover:underline"
            >
              인문대학
            </Link>
            <Link
              href="/departments/science"
              className="text-sm text-green-600 hover:underline"
            >
              자연과학대학
            </Link>
            <Link
              href="/departments/agriculture"
              className="text-sm text-yellow-700 hover:underline"
            >
              농생명대학
            </Link>
          </nav>
          */}
        </header>
        <main className="flex-1 p-4">{children}</main>
        <footer className="bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} JBNU Archive
        </footer>
      </body>
    </html>
  );
}
