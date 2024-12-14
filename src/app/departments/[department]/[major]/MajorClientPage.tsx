"use client";

import { useState, useEffect } from "react";
import PostForm from "@/components/PostForm";

interface MajorClientPageProps {
  department: string;
  major: string;
  // posts?: Post[]; 등 필요시
}

export default function MajorClientPage({
  department,
  major,
}: MajorClientPageProps) {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    // 클라이언트 측에서 department, major를 사용해 fetch
    async function loadPosts() {
      try {
        const res = await fetch(`/api/posts/${department}/${major}`);
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await res.json();
        setPosts(data.data || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadPosts();
  }, [department, major]);

  return (
    <div>
      <h2 className="text-xl font-semibold mt-4">게시글 목록</h2>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>{post.title}</li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mt-4">게시글 작성</h2>
      <PostForm
        department={department}
        major={major}
        onSubmit={async (newPost) => {
          try {
            const res = await fetch(`/api/posts/${department}/${major}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newPost),
            });
            if (!res.ok) {
              throw new Error("Failed to create post");
            }
            const data = await res.json();
            setPosts((prev) => [data.data, ...prev]);
          } catch (error) {
            console.error(error);
          }
        }}
        onCancel={() => {}}
      />
    </div>
  );
}
