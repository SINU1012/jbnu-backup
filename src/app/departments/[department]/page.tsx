// app/departments/[department]/page.tsx
import { notFound } from "next/navigation";
import ClientWrapper from "./ClientWrapper";

export default async function DepartmentPage({ params }: any) {
  // 여기서 params를 any로 받고, 내부에서 필요한 부분만 캐스팅한다.
  const { department } = params as { department: string };

  const res = await fetch(`http://localhost:3000/api/posts/${department}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    notFound();
  }

  const posts = (await res.json()) as any[]; // posts를 any[]로 받거나 별도 타입 정의
  // 혹은 실제 Post 타입을 정의한 뒤 캐스팅 가능

  const deptNameMap: Record<string, string> = {
    humanities: "인문대학",
    science: "자연과학대학",
    agriculture: "농생명대학",
  };
  const deptDisplayName = deptNameMap[department] || department;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {deptDisplayName} 자료보관소
      </h2>
      {posts.length > 0 ? (
        <ul className="mb-8 space-y-2">
          {posts.map((post: any) => (
            <li
              key={post._id}
              className="p-2 border border-gray-300 rounded bg-white text-gray-800"
            >
              <h3 className="font-bold">{post.title}</h3>
              <p>{post.content}</p>
              {post.fileUrls?.length > 0 && (
                <ul className="mt-2 list-disc list-inside space-y-1">
                  {post.fileUrls.map((url: string, idx: number) => (
                    <li key={idx}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        첨부파일 {idx + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 mb-8">등록된 게시글이 없습니다.</p>
      )}
      <ClientWrapper department={department} />
    </div>
  );
}
