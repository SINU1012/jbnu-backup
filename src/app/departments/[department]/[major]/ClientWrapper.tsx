"use client";

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
      // 단일 게시글 삭제는 postId만으로 삭제
      // department, major는 postId만으로 식별 가능?
      // 여기서는 단일 게시글 삭제를 위한 api 변경 필요
      // 하지만 이전에 구현한 코드에서는 postId만으로 삭제 가능했음.
      // 실제로는 department, major 필요하나 여기서는 postId전용 api없으면 필요함.
      // 만약 단일 삭제 API가 /api/posts/[postId]만 있다면:
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
                      <a
                        href={url}
                        download
                        className="text-blue-600 underline"
                      >
                        첨부파일 {idx + 1} 다운로드
                      </a>
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
