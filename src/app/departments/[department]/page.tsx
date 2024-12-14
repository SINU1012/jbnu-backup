// app/departments/[department]/page.tsx
import { notFound } from "next/navigation";
import ClientWrapper from "./ClientWrapper";

// 페이지 컴포넌트에서 별도의 PageProps 인터페이스를 정의하지 않고,
// params 타입을 함수 파라미터에서 인라인으로 지정합니다.
export default async function DepartmentPage({
  params,
}: {
  params: { department: string };
}) {
  const { department } = params;

  const res = await fetch(`http://localhost:3000/api/posts/${department}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    notFound();
  }

  const posts = await res.json();

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
