// app/api/posts/[postId]/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request, context: any) {
  const { params } = context;
  const { postId } = params as { postId: string };

  if (!ObjectId.isValid(postId)) {
    return NextResponse.json(
      { error: "잘못된 게시글 ID입니다." },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("tlsdn1012");
    const collection = db.collection("tlsdn1012");

    const query = { _id: new ObjectId(postId) };
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
        title: post.title,
        content: post.content,
        fileUrls: post.fileUrls || [],
        createdAt: post.createdAt,
        department: post.department,
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";
    console.error("Error fetching post:", errorMessage);
    return NextResponse.json({ error: "서버 에러 발생" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  const { params } = context;
  const { postId } = params as { postId: string };

  if (!ObjectId.isValid(postId)) {
    return NextResponse.json(
      { error: "잘못된 게시글 ID입니다." },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("tlsdn1012");
    const collection = db.collection("tlsdn1012");

    const query = { _id: new ObjectId(postId) };
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
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";
    console.error("Error deleting post:", errorMessage);
    return NextResponse.json({ error: "서버 에러 발생" }, { status: 500 });
  }
}
