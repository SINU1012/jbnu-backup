"use client";

import React, { useEffect, useState, useCallback } from "react";
import PostForm from "@/components/PostForm";

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

export default function ClientWrapper({
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

  // 게시글 작성 제출 함수
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
        // 게시글 작성 성공 후 목록 다시 불러오기
        await fetchPosts();
      } else {
        console.error(json.error || "게시글 생성 실패");
      }
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  // 취소 버튼 클릭 시 동작 (현재는 별도 동작 없음)
  const handleCancel = () => {
    // 필요하다면 여기서 form 초기화 로직을 실행하거나 다른 동작 수행
    console.log("작성 취소");
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
                <ul className="list-disc pl-5 space-y-1">
                  {post.fileUrls.map((url, idx) => (
                    <li key={idx}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        첨부파일 {idx + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-gray-400 mt-2">
                작성일: {new Date(post.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
