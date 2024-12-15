// app/departments/[department]/[major]/page.tsx
import { notFound } from "next/navigation";
import { departments } from "@/data/departments";
import MajorClientPage from "./MajorClientPage";

// 타입 오류 우회를 위해 props: any로 받음 (추후 개선 가능)
export default function MajorPage(props: any) {
  // 런타임에 필요한 키를 안전하게 추출
  const department = props?.params?.department as string;
  const major = props?.params?.major as string;

  if (!department || !major) {
    notFound();
  }

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
