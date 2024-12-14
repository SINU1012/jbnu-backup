// app/departments/[department]/page.tsx
import { notFound } from "next/navigation";
import ClientWrapper from "./ClientWrapper";

interface PageProps {
  params: {
    department: string;
  };
}

// app/departments/[department]/page.tsx
export default async function DepartmentPage({
    params,
  }: {
    params: { department: string };
  }) {
    const { department } = params;
    // department를 사용한 로직...
  }
  

  const posts = await res.json();

  // 부서 이름 매핑 (옵션)
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
