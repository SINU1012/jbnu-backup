"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  const router = useRouter();

  // 서버 응답 처리용 헬퍼 함수
  const handleResponse = async (res: Response) => {
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Server Error Response:", errorText);
      return { error: "서버 요청에 실패했습니다." };
    }

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

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      // 히스토리가 없는 경우 메인 페이지나 다른 경로로 이동
      router.push("/");
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-6">
      {/* 인포커스 로고와 뒤로가기 버튼 섹션 */}
      <div className="flex items-center justify-between mb-8">
        {/* 인포커스 로고 표시 */}
        <Image
          src="/images/infocus-logo.png"
          alt="Infocus Logo"
          width={150}
          height={50}
          priority
        />
        {/* 뒤로가기 버튼 */}
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          뒤로가기
        </button>
      </div>

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
                router.push(`/posts/${postId}`);
              }}
            />
          )}
        </div>
      )}
    </main>
  );
}
