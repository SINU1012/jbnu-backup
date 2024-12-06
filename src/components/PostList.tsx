// PostList.tsx (개선 후)
// 수정 사항 없음. 필요 시 부서별 페이지에서 import해서 사용 가능.
import React from "react";

interface Post {
  _id: string;
  title: string;
  content: string;
  fileUrls: string[];
  createdAt: string;
  department: string;
}

interface PostListProps {
  posts: Post[];
  onPostClick: (postId: string) => void;
}

export default function PostList({ posts, onPostClick }: PostListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post._id}
          onClick={() => onPostClick(post._id)}
          className="p-4 bg-white rounded-lg border border-gray-200 
                   hover:shadow-md transition-shadow cursor-pointer"
        >
          <h3 className="text-lg font-medium mb-2">{post.title}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {post.content}
          </p>
          {post.fileUrls.length > 0 && (
            <div className="flex gap-2 mb-2">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
              <span className="text-sm text-gray-500">
                첨부파일 {post.fileUrls.length}개
              </span>
            </div>
          )}
          <div className="text-sm text-gray-400">
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
