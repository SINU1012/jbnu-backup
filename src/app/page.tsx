// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import DepartmentSelector from "@/components/DepartmentSelector";
import PostForm from "@/components/PostForm";
import PostList from "@/components/PostList";

interface Post {
  _id: string;
  title: string;
  content: string;
  fileUrls: string[];
  createdAt: string;
  department: string;
}

export default function Home() {
  const [selectedDept, setSelectedDept] = useState("");
  const [showPostForm, setShowPostForm] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 게시글 목록 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      if (selectedDept) {
        setLoading(true);
        try {
          const res = await fetch(
            `/api/posts?department=${encodeURIComponent(selectedDept)}`
          );
          const data = await res.json();

          if (res.ok) {
            if (Array.isArray(data)) {
              setPosts(data);
              setError(null);
            } else if (data.error) {
              setError(data.error);
              setPosts([]);
            } else {
              setError("알 수 없는 응답 형식입니다.");
              setPosts([]);
            }
          } else {
            setError(data.error || "게시글을 불러오는데 실패했습니다.");
            setPosts([]);
          }
        } catch (err) {
          console.error("Fetch Error:", err);
          setError("게시글을 불러오는 중 오류가 발생했습니다.");
          setPosts([]);
        } finally {
          setLoading(false);
        }
      } else {
        setPosts([]);
        setError(null);
      }
    };

    fetchPosts();
  }, [selectedDept]);

  // 게시글 작성 처리
  const handlePostSubmit = async (
    postData: Omit<Post, "_id" | "createdAt">
  ) => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const data = await res.json();

      if (res.ok) {
        setShowPostForm(false);
        // 목록 새로고침
        const newPostsRes = await fetch(
          `/api/posts?department=${encodeURIComponent(selectedDept)}`
        );
        const newPostsData = await newPostsRes.json();

        if (newPostsRes.ok) {
          if (Array.isArray(newPostsData)) {
            setPosts(newPostsData);
            setError(null);
          } else if (newPostsData.error) {
            setError(newPostsData.error);
            setPosts([]);
          } else {
            setError("알 수 없는 응답 형식입니다.");
            setPosts([]);
          }
        } else {
          setError(newPostsData.error || "게시글을 불러오는데 실패했습니다.");
          setPosts([]);
        }
      } else {
        setError(data.error || "게시글 작성에 실패했습니다.");
      }
    } catch (error) {
      console.error("Post Submit Error:", error);
      setError("게시글 작성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">인문대학 자료실</h1>

      {!selectedDept ? (
        <DepartmentSelector
          selectedDept={selectedDept}
          onSelect={setSelectedDept}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{selectedDept}</h2>
            <button
              onClick={() => setShowPostForm(true)}
              className="px-4 py-2 bg-violet-600 text-white rounded-md"
            >
              새 글 작성
            </button>
          </div>

          {showPostForm && (
            <PostForm
              department={selectedDept}
              onSubmit={handlePostSubmit}
              onCancel={() => setShowPostForm(false)}
            />
          )}

          {loading ? (
            <div>로딩 중...</div>
          ) : error ? (
            <div className="text-red-500">오류: {error}</div>
          ) : (
            <PostList
              posts={posts}
              onPostClick={(postId) => {
                // 게시글 상세 페이지로 이동
                window.location.href = `/posts/${postId}`;
              }}
            />
          )}
        </div>
      )}
    </main>
  );
}
