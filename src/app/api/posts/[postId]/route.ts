import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request, context: any) {
  const { postId } = context.params as { postId: string };

  // postId가 ObjectId로 변환 불가능한 경우 바로 에러 반환
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

    // query를 ObjectId 타입으로 확실히 지정
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
  } catch (error: any) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "서버 에러 발생" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  const { postId } = context.params as { postId: string };

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
  } catch (error: any) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "서버 에러 발생" }, { status: 500 });
  }
}
