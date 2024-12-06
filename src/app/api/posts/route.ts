import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");

    const client = await clientPromise;
    const db = client.db("인문대아카이브");

    if (!department) {
      return NextResponse.json(
        { error: "부서를 지정해주세요." },
        { status: 400 }
      );
    }

    const posts = await db
      .collection("posts")
      .find({ department })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET /api/posts 에러:", error);
    return NextResponse.json(
      { error: "게시글을 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 필수 필드 검증
    if (!body.department || !body.title || !body.content) {
      return NextResponse.json(
        { error: "필수 필드가 누락되었습니다." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("인문대아카이브");

    const post = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("posts").insertOne(post);
    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/posts 에러:", error);
    return NextResponse.json(
      { error: "게시글 작성에 실패했습니다." },
      { status: 500 }
    );
  }
}
