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

  // 서버 응답 처리용 헬퍼 함수
  const handleResponse = async (res: Response) => {
    if (!res.ok) {
      // 에러 응답 시 HTML 또는 일반 텍스트일 수 있으므로 text로 받음
      const errorText = await res.text();
      console.error("Server Error Response:", errorText);
      return { error: "서버 요청에 실패했습니다." };
    }

    // 정상 응답 -> JSON 파싱 시도
    const jsonData = await res.json();
    return jsonData;
  };

  // 게시글 목록 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      if (!selectedDept) {
        setPosts([]);
        setError(null);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `/api/posts?department=${encodeURIComponent(selectedDept)}`
        );
        const jsonData = await handleResponse(res);

        if (jsonData.error) {
          setError(jsonData.error);
          setPosts([]);
        } else if (Array.isArray(jsonData.data)) {
          setPosts(jsonData.data);
          setError(null);
        } else {
          // data 필드가 없거나 예상치 못한 응답 형식
          console.error("Unknown response format:", jsonData);
          setError("알 수 없는 응답 형식입니다.");
          setPosts([]);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
        setPosts([]);
      } finally {
        setLoading(false);
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

      const jsonData = await handleResponse(res);

      if (jsonData.error) {
        setError(jsonData.error);
      } else {
        // 게시글 작성 성공 시 폼 닫고 목록 갱신
        setShowPostForm(false);
        const newPostsRes = await fetch(
          `/api/posts?department=${encodeURIComponent(selectedDept)}`
        );
        const newPostsData = await handleResponse(newPostsRes);

        if (newPostsData.error) {
          setError(newPostsData.error);
          setPosts([]);
        } else if (Array.isArray(newPostsData.data)) {
          setPosts(newPostsData.data);
          setError(null);
        } else {
          console.error("Unknown response format after POST:", newPostsData);
          setError("알 수 없는 응답 형식입니다.");
          setPosts([]);
        }
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
