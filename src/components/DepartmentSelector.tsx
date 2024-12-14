// src/components/DepartmentSelector.tsx

import React from "react";

// 단과대학 리스트 (영문 슬러그 사용)
const departments = ["humanities", "science", "agriculture"];

interface DepartmentSelectorProps {
  selectedDept: string;
  onSelect: (dept: string) => void;
}

export default function DepartmentSelector({
  selectedDept,
  onSelect,
}: DepartmentSelectorProps) {
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
          <h3 className="text-lg font-medium capitalize">{dept}</h3>
          <p className="text-sm text-gray-600 mt-2">Enter the {dept} archive</p>
        </div>
      ))}
    </div>
  );
}
