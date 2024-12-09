import React from "react";

const departments = [
  "국어국문학과",
  "사학과",
  "철학과",
  "영어영문학과",
  "독일학과",
  "스페인ㆍ중남미학과",
  "프랑스ㆍ아프리카학과",
  "일본학과",
  "중어중문학과",
  "고고문화인류학과",
  "문헌정보학과",
  "국제학부",
];

export default function DepartmentSelector({
  selectedDept,
  onSelect,
}: {
  selectedDept: string;
  onSelect: (dept: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {departments.map((dept) => (
        <div
          key={dept}
          onClick={() => onSelect(dept)}
          className={`p-6 rounded-lg cursor-pointer transition-all ${
            selectedDept === dept
              ? "bg-violet-100 border-2 border-violet-500"
              : "bg-white hover:shadow-lg border border-gray-200"
          }`}
        >
          <h3 className="text-lg font-medium">{dept}</h3>
          <p className="text-sm text-gray-600 mt-2">자료실 바로가기</p>
        </div>
      ))}
    </div>
  );
}
