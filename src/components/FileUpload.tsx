// components/FileUpload.tsx
import { useState } from "react";
// 아래 경로는 실제 firebase.ts 파일 위치에 따라 조정
// firebase.ts가 src 폴더 바로 아래 있다면 "../firebase"가 맞음
// firebase.ts가 src/lib 폴더 아래라면 "../lib/firebase"로 수정
import { storage } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface FileUploadProps {
  onUploadComplete: (urls: string[]) => void;
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    setUploading(true);
    const files = Array.from(e.target.files);
    const uploadPromises = files.map(async (file) => {
      const fileRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
      await uploadBytes(fileRef, file);
      return getDownloadURL(fileRef);
    });

    try {
      const urls = await Promise.all(uploadPromises);
      onUploadComplete(urls);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">
        파일 첨부
      </label>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        disabled={uploading}
        className="mt-1 block w-full text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
      />
      {uploading && <p className="mt-2 text-sm text-gray-500">업로드중...</p>}
    </div>
  );
}
