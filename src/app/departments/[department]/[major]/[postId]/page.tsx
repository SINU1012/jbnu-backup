// app/departments/[department]/[major]/[postId]/page.tsx
import styles from "./page.module.css";
import { notFound } from "next/navigation";

interface Post {
  _id: string;
  department: string;
  major: string;
  title: string;
  content: string;
  fileUrls: string[];
  createdAt: string;
}

export const dynamic = "force-dynamic";

export default async function PostPage(props: any) {
  // props: any로 받아서 params를 런타임에 캐스팅
  const { params } = props;

  // 런타임에 department, major, postId 추출
  const department = (params?.department as string) || "";
  const major = (params?.major as string) || "";
  const postId = (params?.postId as string) || "";

  if (!department || !major || !postId) {
    notFound();
  }

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(
    `${baseURL}/api/posts/${department}/${major}/${postId}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    notFound();
  }

  const { data: post }: { data: Post } = await res.json();

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <div className={styles.titleHeader}>제목</div>
        <div className={styles.titleBody}>
          <h1 style={{ margin: 0 }}>{post.title}</h1>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>내용</div>
        <div className={styles.sectionBody}>
          <p>{post.content}</p>
        </div>
      </div>
      {post.fileUrls && post.fileUrls.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>첨부파일</div>
          <div className={styles.sectionBody}>
            <ul className={styles.fileList}>
              {post.fileUrls.map((url: string, idx: number) => (
                <li key={idx}>
                  <a href={url} download>
                    파일 {idx + 1} 다운로드
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}