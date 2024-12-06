import { NextResponse } from "next/server";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    // Firebase Storage에 파일 업로드
    const fileRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
    const buffer = await file.arrayBuffer();
    await uploadBytes(fileRef, buffer);

    // 업로드된 파일의 URL 가져오기
    const fileUrl = await getDownloadURL(fileRef);

    return NextResponse.json({ fileUrl });
  } catch (error) {
    return NextResponse.json(
      { error: "파일 업로드에 실패했습니다." },
      { status: 500 }
    );
  }
}
