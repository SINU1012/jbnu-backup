import { notFound } from "next/navigation";
import { departments } from "@/data/departments";
import MajorClientPage from "./MajorClientPage";

export default function MajorPage({
  params,
}: {
  params: Record<string, string>;
}) {
  const { department, major } = params as { department: string; major: string };

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
