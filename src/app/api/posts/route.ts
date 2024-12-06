import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");

    if (!department || department.trim() === "") {
      return NextResponse.json(
        { error: "부서를 지정해주세요. (예: ?department=국어국문학과)" },
        { status: 400 }
      );
    }

    console.log("MongoDB 연결 시도...");
    const client = await clientPromise;
    const db = client.db("tlsdn1012");
    const collection = db.collection("tlsdn1012");

    console.log(`게시글 조회 중 (부서: ${department})`);
    const posts = await collection
      .find({ department })
      .sort({ createdAt: -1 })
      .toArray();

    if (posts.length === 0) {
      return NextResponse.json({
        message: "검색된 게시글이 없습니다.",
        data: [],
      });
    }

    return NextResponse.json({
      message: "게시글 조회 성공",
      data: posts,
    });
  } catch (error) {
    console.error("GET /api/posts 에러:", error);
    return NextResponse.json(
      {
        error: "게시글을 불러오는데 실패했습니다.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.department) {
      return NextResponse.json(
        { error: "부서 정보가 누락되었습니다. (department 필수)" },
        { status: 400 }
      );
    }

    if (!body.title) {
      return NextResponse.json(
        { error: "제목 정보가 누락되었습니다. (title 필수)" },
        { status: 400 }
      );
    }

    if (!body.content) {
      return NextResponse.json(
        { error: "내용 정보가 누락되었습니다. (content 필수)" },
        { status: 400 }
      );
    }

    console.log("MongoDB 연결 시도...");
    const client = await clientPromise;
    const db = client.db("tlsdn1012");
    const collection = db.collection("tlsdn1012");

    const post = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(post);

    return NextResponse.json({
      message: "게시글 작성에 성공했습니다.",
      data: { id: result.insertedId, ...post },
    });
  } catch (error) {
    console.error("POST /api/posts 에러:", error);
    return NextResponse.json(
      {
        error: "게시글 작성에 실패했습니다.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
