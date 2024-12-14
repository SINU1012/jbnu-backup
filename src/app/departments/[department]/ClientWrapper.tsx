// src/app/departments/[department]/ClientWrapper.tsx
"use client";

import PostForm from "../../../components/PostForm";
import { Post } from "@/types/post";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ClientWrapperProps {
  department: string;
}

export default function ClientWrapper({ department }: ClientWrapperProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const onSubmit = async (postData: Omit<Post, "id" | "createdAt">) => {
    const res = await fetch(`/api/posts/${department}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });

    if (!res.ok) {
      setMessage("게시글 작성 실패");
      return;
    }
    setMessage("게시글이 성공적으로 작성되었습니다.");
    router.refresh();
  };

  const onCancel = () => {
    console.log("취소되었습니다.");
  };

  return (
    <div>
      {message && (
        <div className="mb-4 p-2 bg-green-100 border border-green-300 rounded text-green-800">
          {message}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">새 게시글 작성</h3>
      <PostForm
        department={department}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}
