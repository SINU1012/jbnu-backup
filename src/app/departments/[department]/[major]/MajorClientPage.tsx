"use client"; // 클라이언트 컴포넌트 선언

// 여기서는 dynamic = "force-dynamic" 불필요. 페이지나 레이아웃에서 필요한 옵션임.
// export const dynamic = "force-dynamic";

import React, { useEffect, useState, useCallback } from "react";
import PostForm from "@/components/PostForm";
import Link from "next/link";

interface ClientWrapperProps {
  department: string;
  major: string;
}

interface Post {
  _id: string;
  department: string;
  major: string;
  title: string;
  content: string;
  fileUrls: string[];
  createdAt: string;
}

export default function MajorClientPage({
  department,
  major,
}: ClientWrapperProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${department}/${major}`, {
        cache: "no-store",
      });
      const json = await res.json();
      if (res.ok && Array.isArray(json.data)) {
        setPosts(json.data);
      } else {
        console.error(json.error || "게시글 불러오기 실패");
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [department, major]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostSubmit = async (postData: {
    title: string;
    content: string;
    fileUrls: string[];
  }) => {
    try {
      const res = await fetch(`/api/posts/${department}/${major}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
      const json = await res.json();
      if (res.ok) {
        console.log("게시글 작성 성공");
        await fetchPosts();
      } else {
        console.error(json.error || "게시글 생성 실패");
      }
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  const handleCancel = () => {
    console.log("작성 취소");
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("정말 이 게시글을 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/posts/${department}/${major}/${postId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok) {
        console.log("게시글 삭제 성공");
        await fetchPosts();
      } else {
        console.error(json.error || "게시글 삭제 실패");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const forceDownload = async (url: string, filename: string) => {
    try {
      // Firebase Storage CORS 설정이 안되어 있으면 여기서 CORS 에러 발생
      const response = await fetch(url);
      if (!response.ok) {
        console.error("파일을 가져오는 중 오류 발생:", response.statusText);
        return;
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("파일 다운로드 중 오류:", error);
    }
  };

  return (
    <div className="mt-4">
      <PostForm
        department={department}
        major={major}
        onSubmit={handlePostSubmit}
        onCancel={handleCancel}
        onPostCreated={fetchPosts}
      />
      {loading ? (
        <div className="mt-4">로딩 중...</div>
      ) : posts.length === 0 ? (
        <div className="mt-4 text-gray-500">등록된 게시글이 없습니다.</div>
      ) : (
        <ul className="mt-4 space-y-4">
          {posts.map((post) => (
            <li key={post._id} className="border p-4 rounded-md bg-white">
              <h3 className="font-bold text-lg mb-2">{post.title}</h3>
              <p className="text-sm text-gray-700 mb-2">{post.content}</p>
              {post.fileUrls.length > 0 && (
                <ul className="list-disc pl-5 space-y-1 mb-2">
                  {post.fileUrls.map((url, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => forceDownload(url, `file_${idx + 1}`)}
                        className="text-blue-600 underline"
                      >
                        첨부파일 {idx + 1} 다운로드
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-gray-400 mb-2">
                작성일: {new Date(post.createdAt).toLocaleString()}
              </p>
              <div className="flex space-x-2">
                <Link
                  href={`/departments/${department}/${major}/${post._id}`}
                  className="text-blue-600 underline text-sm"
                >
                  상세보기
                </Link>
                <button
                  onClick={() => handleDeletePost(post._id)}
                  className="text-red-600 underline text-sm"
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
