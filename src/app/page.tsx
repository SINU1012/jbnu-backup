"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PASSWORDS: Record<string, string> = {
  humanities: "humanities123",
  science: "science123",
  agriculture: "agri123",
};

export default function HomePage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [inputPassword, setInputPassword] = useState("");
  const [error, setError] = useState("");

  const handleDeptClick = (department: string) => {
    setSelectedDept(department);
    setInputPassword("");
    setError("");
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (selectedDept && PASSWORDS[selectedDept] === inputPassword) {
      router.push(`/departments/${selectedDept}`);
    } else {
      setError("비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">메인 페이지</h2>
      <p className="mb-4">접근할 자료보관소를 선택하세요:</p>
      <div className="flex gap-4">
        <button
          onClick={() => handleDeptClick("humanities")}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          인문대학 자료보관소
        </button>
        <button
          onClick={() => handleDeptClick("science")}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          자연과학대학 자료보관소
        </button>
        <button
          onClick={() => handleDeptClick("agriculture")}
          className="px-4 py-2 bg-yellow-600 text-white rounded"
        >
          농생명대학 자료보관소
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-2">
              {selectedDept === "humanities" && "인문대학"}
              {selectedDept === "science" && "자연과학대학"}
              {selectedDept === "agriculture" && "농생명대학"} 자료보관소
            </h3>
            <p className="mb-2">비밀번호를 입력해주세요.</p>
            <input
              type="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
