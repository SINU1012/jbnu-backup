// src/types/post.ts
export interface Post {
  id: string;
  title: string;
  content: string;
  fileUrls: string[];
  createdAt: string; // ISO 8601 형식의 날짜 문자열 또는 Date 타입
  // 기타 필드들...
}
