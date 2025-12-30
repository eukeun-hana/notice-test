import { useEffect, useState } from "react"
import dayjs from "dayjs"

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "../../firebase"

type Post = {
  id: string
  name: string
  content: string
  createdAt: number
}

export default function GuestBook() {
  const [posts, setPosts] = useState<Post[]>([])
  const [name, setName] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  /** 방명록 불러오기 */
  const loadPosts = async () => {
    const q = query(
      collection(db, "guestbook"),
      orderBy("createdAt", "desc"),
      limit(3),
    )

    const snapshot = await getDocs(q)

    const list: Post[] = snapshot.docs.map((doc) => {
      const data = doc.data() as any

      return {
        id: doc.id,
        name: data.name ?? "",
        content: data.content ?? "",
        createdAt: data.createdAt?.seconds ?? 0,
      }
    })

    setPosts(list)
  }

  /** 방명록 저장 */
  const submitGuestBook = async () => {
    if (!name.trim() || !content.trim()) {
      alert("이름과 내용을 입력해주세요")
      return
    }

    if (loading) return

    try {
      setLoading(true)

      await addDoc(collection(db, "guestbook"), {
        name,
        content,
        createdAt: serverTimestamp(),
      })

      setName("")
      setContent("")
      await loadPosts()

      alert("방명록이 등록되었습니다 💍")
    } catch (e) {
      alert("저장 중 오류가 발생했습니다")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  return (
    <div>
      <h2>방명록</h2>

      {/* 작성 영역 */}
      <div>
        <input
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="축하 메시지를 남겨주세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={submitGuestBook} disabled={loading}>
          {loading ? "등록 중..." : "방명록 남기기"}
        </button>
      </div>

      {/* 목록 */}
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <div>
              <strong>{post.name}</strong>
              <span style={{ marginLeft: 8, fontSize: 12 }}>
                {dayjs.unix(post.createdAt).format("YYYY.MM.DD HH:mm")}
              </span>
            </div>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
