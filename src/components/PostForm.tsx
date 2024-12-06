import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

interface PostFormProps {
  department: string;
  onSubmit: (post: Omit<Post, "_id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

interface Post {
  _id?: string;
  title: string;
  content: string;
  fileUrls: string[];
  department: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function PostForm({
  department,
  onSubmit,
  onCancel,
}: PostFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // 파일 업로드 처리
      const fileUrls: string[] = [];
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileRef = ref(
            storage,
            `uploads/${department}/${Date.now()}-${file.name}`
          );
          await uploadBytes(fileRef, file);
          const url = await getDownloadURL(fileRef);
          fileUrls.push(url);
        }
      }

      // 게시글 데이터 생성
      const postData: Omit<Post, "_id" | "createdAt" | "updatedAt"> = {
        department,
        title,
        content,
        fileUrls,
      };

      await onSubmit(postData);
      setTitle("");
      setContent("");
      setFiles(null);
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("게시글 작성 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded-md h-32"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">파일 첨부</label>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
          className="w-full text-sm file:mr-4 file:py-2 file:px-4 
                     file:rounded-full file:border-0 file:bg-violet-50 
                     file:text-violet-700"
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
          disabled={uploading}
        >
          취소
        </button>
        <button
          type="submit"
          disabled={uploading}
          className="px-4 py-2 bg-violet-600 text-white rounded-md 
                   hover:bg-violet-700 disabled:opacity-50"
        >
          {uploading ? "업로드 중..." : "저장"}
        </button>
      </div>
    </form>
  );
}
