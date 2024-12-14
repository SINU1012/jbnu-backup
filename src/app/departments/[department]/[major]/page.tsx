import { notFound } from "next/navigation";
import { departments } from "@/data/departments";
import MajorClientPage from "./MajorClientPage";

interface Params {
  department: string;
  major: string;
}

// 필요 시 사용
// export const dynamic = "force-dynamic";

export default function MajorPage({ params }: { params: Params }) {
  const { department, major } = params;

  const deptData = departments[department as keyof typeof departments];
  if (!deptData) {
    notFound();
  }

  const majorData = deptData.find((m) => m.slug === major);
  if (!majorData) {
    notFound();
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{majorData.name} 자료실</h1>
      <p>이 곳에서 게시글을 관리할 수 있습니다.</p>
      <MajorClientPage department={department} major={major} />
    </div>
  );
}