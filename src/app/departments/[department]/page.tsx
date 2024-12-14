import { notFound } from "next/navigation";
import Link from "next/link";
import { departments } from "@/data/departments";

const deptNameMap: Record<string, string> = {
  humanities: "인문대학",
  science: "자연과학대학",
  agriculture: "농생명대학",
};

export default function DepartmentPage({
  params,
}: {
  params: { department: string };
}) {
  const { department } = params;

  const deptMajors = departments[department as keyof typeof departments];
  if (!deptMajors) {
    notFound();
  }

  const deptDisplayName = deptNameMap[department] || department;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{deptDisplayName} 자료보관소</h1>
      <p className="mb-4">아래 전공을 선택하세요:</p>
      <ul className="space-y-2">
        {deptMajors.map((major) => (
          <li key={major.slug}>
            <Link
              href={`/departments/${department}/${major.slug}`}
              className="text-blue-600 hover:underline"
            >
              {major.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
