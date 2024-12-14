// app/api/posts/[department]/[major]/route.ts
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { departments } from "@/data/departments";

interface Post {
  _id?: string;
  department: string;
  major: string;
  title: string;
  content: string;
  fileUrls: string[];
  createdAt?: string;
}

interface Params {
  params: { department: string; major: string };
}

function validateDeptAndMajor(department: string, major: string) {
  const deptMajors = departments[department as keyof typeof departments];
  if (!deptMajors || !deptMajors.some((m) => m.slug === major)) {
    return false;
  }
  return true;
}

export async function GET(request: Request, { params }: Params) {
  const { department, major } = params;

  if (!validateDeptAndMajor(department, major)) {
    return NextResponse.json(
      { error: "존재하지 않는 대학 또는 전공입니다." },
      { status: 404 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("tlsdn1012");
    const collection = db.collection("posts");

    const query = { department, major };
    const postDocs = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const posts = postDocs.map((doc) => ({
      _id: doc._id.toString(),
      department: doc.department,
      major: doc.major,
      title: doc.title,
      content: doc.content,
      fileUrls: doc.fileUrls || [],
      createdAt: doc.createdAt,
    }));

    return NextResponse.json({ message: "게시글 목록 조회 성공", data: posts });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    console.error("Error fetching posts:", errorMessage);
    return NextResponse.json({ error: "서버 에러 발생" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: Params) {
  const { department, major } = params;

  if (!validateDeptAndMajor(department, major)) {
    return NextResponse.json(
      { error: "존재하지 않는 대학 또는 전공입니다." },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const { title, content, fileUrls } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "title과 content는 필수 필드입니다." },
        { status: 400 }
      );
    }

    const newPost: Post = {
      department,
      major,
      title,
      content,
      fileUrls: Array.isArray(fileUrls) ? fileUrls : [],
      createdAt: new Date().toISOString(),
    };

    const client = await clientPromise;
    const db = client.db("tlsdn1012");
    const collection = db.collection("posts");

    const result = await collection.insertOne(newPost);
    if (!result.insertedId) {
      return NextResponse.json({ error: "게시글 생성 실패" }, { status: 500 });
    }

    return NextResponse.json({
      message: "게시글 작성 성공",
      data: { ...newPost, _id: result.insertedId.toString() },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    console.error("Error creating post:", errorMessage);
    return NextResponse.json({ error: "서버 에러 발생" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const { department, major } = params;

  if (!validateDeptAndMajor(department, major)) {
    return NextResponse.json(
      { error: "존재하지 않는 대학 또는 전공입니다." },
      { status: 404 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("tlsdn1012");
    const collection = db.collection("posts");

    const query = { department, major };
    const result = await collection.deleteMany(query);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "삭제할 게시글이 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "전공 관련 게시글 전체 삭제 성공" });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    console.error("Error deleting posts:", errorMessage);
    return NextResponse.json({ error: "서버 에러 발생" }, { status: 500 });
  }
}