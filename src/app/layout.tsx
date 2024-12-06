// app/layout.tsx
import "./globals.css"; // 전역 CSS 파일 임포트 (필요 시)
import { ReactNode } from "react";

export const metadata = {
  title: "JBNU Humanities",
  description: "JBNU Humanities 프로젝트",
  icons: {
    icon: "/favicon.ico",
  },
  // 기타 메타데이터...
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* 추가적인 head 요소들 (메타 태그, 링크 등) */}
        <link rel="icon" href="/favicon.ico" />
        {/* 필요에 따라 다른 메타 태그 추가 */}
      </head>
      <body>{children}</body>
    </html>
  );
}
