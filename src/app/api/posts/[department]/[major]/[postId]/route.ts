// app/api/posts/[department]/[major]/[postId]/route.ts
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { departments } from "@/data/departments";

function validateDeptAndMajor(department: string, major: string) {
  const deptMajors = departments[department as keyof typeof departments];
  return deptMajors && deptMajors.some((m) => m.slug === major);
}

export async function GET(
  request: Request,
  { params }: { params: Record<string, string> }
) {
  const { department, major, postId } = params;

  if (!validateDeptAndMajor(department, major)) {
    return NextResponse.json(
      { error: "존재하지 않는 대학 또는 전공입니다." },
      { status: 404 }
    );
  }

  if (!ObjectId.isValid(postId)) {
    return NextResponse.json(
      { error: "잘못된 게시글 ID입니다." },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("tlsdn1012");
    const collection = db.collection("posts");

    const query = { _id: new ObjectId(postId), department, major };
    const post = await collection.findOne(query);

    if (!post) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "게시글 조회 성공",
      data: {
        _id: post._id.toString(),
        department: post.department,
        major: post.major,
        title: post.title,
        content: post.content,
        fileUrls: post.fileUrls || [],
        createdAt: post.createdAt,
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    console.error("Error fetching post:", errorMessage);
    return NextResponse.json({ error: "서버 에러 발생" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: { department: string; major: string; postId: string } }
) {
  const { department, major, postId } = context.params;

  if (!validateDeptAndMajor(department, major)) {
    return NextResponse.json(
      { error: "존재하지 않는 대학 또는 전공입니다." },
      { status: 404 }
    );
  }

  if (!ObjectId.isValid(postId)) {
    return NextResponse.json(
      { error: "잘못된 게시글 ID입니다." },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("tlsdn1012");
    const collection = db.collection("posts");

    const query = { _id: new ObjectId(postId), department, major };
    const result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "삭제할 게시글이 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "게시글 삭제 성공" });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    console.error("Error deleting post:", errorMessage);
    return NextResponse.json({ error: "서버 에러 발생" }, { status: 500 });
  }
}
