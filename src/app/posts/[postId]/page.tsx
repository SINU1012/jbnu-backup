import styles from "./page.module.css";
import DeleteButton from "./DeleteButton"; // 추가된 임포트

export default async function PostPage({ params }: any) {
  const { postId } = params as { postId: string };

  const res = await fetch(`/api/posts/${postId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div className={styles.container}>게시글을 찾을 수 없습니다.</div>;
  }

  const { data: post } = await res.json();

  return (
    <div className={styles.container}>
      {/* 제목 섹션 */}
      <div className={styles.title}>
        <div className={styles.titleHeader}>제목</div>
        <div className={styles.titleBody}>
          <h1 style={{ margin: 0 }}>{post.title}</h1>
        </div>
      </div>

      {/* 내용 섹션 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>내용</div>
        <div className={styles.sectionBody}>
          <p>{post.content}</p>
        </div>
      </div>

      {/* 첨부파일 섹션 */}
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

      {/* 게시글 삭제 버튼 추가 */}
      <DeleteButton postId={postId} />
    </div>
  );
}
