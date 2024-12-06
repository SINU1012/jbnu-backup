// src/models/post.ts
export interface Post {
  _id?: string;
  department: string; // 학과명
  title: string; // 제목
  content: string; // 내용
  fileUrls: string[]; // 첨부파일 URL 목록
  createdAt: Date; // 작성일
  updatedAt: Date; // 수정일
}
