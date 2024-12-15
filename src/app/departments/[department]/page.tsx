// 예: app/departments/[department]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { departments } from "@/data/departments";

const deptNameMap: Record<string, string> = {
  humanities: "인문대학",
  science: "자연과학대학",
  agriculture: "농생명대학",
};

export default function DepartmentPage(props: any) {
  const { department } = props.params as { department: string };

  const deptMajors = departments[department as keyof typeof departments];
  if (!deptMajors) {
    notFound();
  }

  const deptDisplayName = deptNameMap[department] || department;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{deptDisplayName} 자료보관소</h1>
      <p className="text-gray-700 mb-4">아래 전공을 선택하세요:</p>

      <ul className="grid sm:grid-cols-2 gap-4">
        {deptMajors.map((major) => (
          <li
            key={major.slug}
            className="bg-white shadow p-4 rounded hover:shadow-md transition"
          >
            <Link
              href={`/departments/${department}/${major.slug}`}
              className="text-blue-600 hover:underline font-medium"
            >
              {major.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
