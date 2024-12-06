"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteButtonProps {
  postId: string;
}

export default function DeleteButton({ postId }: DeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (res.ok) {
        // 삭제 성공 시 /posts 페이지로 이동 (게시글 목록 페이지라고 가정)
        router.push("/posts");
      } else {
        // 에러 처리 (alert, toast 등)
        alert("삭제 실패");
      }
    } catch (error) {
      console.error(error);
      alert("오류 발생");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      style={{
        marginTop: "1rem",
        padding: "0.5rem 1rem",
        background: "#dc3545",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      {loading ? "삭제 중..." : "게시글 삭제"}
    </button>
  );
}
