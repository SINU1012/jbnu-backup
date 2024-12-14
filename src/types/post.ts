// src/types/post.ts
export interface Post {
  id: string; // DB에서 생성되는 고유 ID
  title: string;
  content: string;
  fileUrls: string[];
  department: string;
  createdAt: string; // ISO 8601 형식의 날짜 문자열
  // 필요하다면 updatedAt, 기타 필드 추가 가능
}
