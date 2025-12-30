import { useEffect, useRef, useState } from "react"
import { Button } from "../button"
import { dayjs } from "../../const"
import { LazyDiv } from "../lazyDiv"
import { useModal } from "../modal"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "../../firebase"

type Post = {
  id: string
  name: string
  content: string
  password: string
  timestamp: number
}

export default function GuestBook() {
  const { openModal, closeModal } = useModal()
  const [posts, setPosts] = useState<Post[]>([])

  const loadPosts = async () => {
    const q = query(
      collection(db, "guestbook"),
      orderBy("createdAt", "desc"),
      limit(4),
    )

    const snap = await getDocs(q)

    setPosts(
      snap.docs.map((d) => ({
        id: d.id,
        name: d.data().name,
        content: d.data().content,
        password: d.data().password,
        timestamp: d.data().createdAt?.seconds ?? 0,
      })),
    )
  }

  useEffect(() => {
    loadPosts()
  }, [])

  return (
    <LazyDiv className="card guestbook">
      <h2 className="english">Guest Book</h2>
      <div className="break" />

      {posts.map((post) => (
        <div key={post.id} className="post">
          <div className="heading">
            <button
              className="close-button"
              onClick={() =>
                openModal({
                  className: "delete-guestbook-modal",
                  closeOnClickBackground: false,
                  header: <div className="title">삭제하시겠습니까?</div>,
                  content: (
                    <DeleteGuestBookModal
                      post={post}
                      onSuccess={loadPosts}
                    />
                  ),
                  footer: (
                    <>
                      <Button
                        buttonStyle="style2"
                        type="submit"
                        form="guestbook-delete-form"
                      >
                        삭제하기
                      </Button>
                      <Button
                        buttonStyle="style2"
                        className="bg-light-grey-color text-dark-color"
                        onClick={closeModal}
                      >
                        닫기
                      </Button>
                    </>
                  ),
                })
              }
            />
          </div>

          <div className="body">
            <div className="title">
              <div className="name">{post.name}</div>
              <div className="date">
                {dayjs.unix(post.timestamp).format("YYYY-MM-DD")}
              </div>
            </div>
            <div className="content">{post.content}</div>
          </div>
        </div>
      ))}

      <div className="break" />

      <Button
        onClick={() =>
          openModal({
            className: "write-guestbook-modal",
            closeOnClickBackground: false,
            header: (
              <div className="title-group">
                <div className="title">방명록 작성하기</div>
                <div className="subtitle">
                  신랑, 신부에게 축하의 마음을 전해주세요.
                </div>
              </div>
            ),
            content: <WriteGuestBookModal loadPosts={loadPosts} />,
            footer: (
              <>
                <Button
                  buttonStyle="style2"
                  type="submit"
                  form="guestbook-write-form"
                >
                  저장하기
                </Button>
                <Button
                  buttonStyle="style2"
                  className="bg-light-grey-color text-dark-color"
                  onClick={closeModal}
                >
                  닫기
                </Button>
              </>
            ),
          })
        }
      >
        방명록 작성하기
      </Button>

      <div className="break" />

      <Button
        onClick={() =>
          openModal({
            className: "all-guestbook-modal",
            closeOnClickBackground: true,
            header: <div className="title">방명록 전체보기</div>,
            content: (
              <AllGuestBookModal 
                onDeleted={loadPosts}
              />
            ),
            footer: (
              <Button
                buttonStyle="style2"
                className="bg-light-grey-color text-dark-color"
                onClick={closeModal}
              >
                닫기
              </Button>
            ),
          })
        }
      >
        방명록 전체보기
      </Button>
    </LazyDiv>
  )
}

const WriteGuestBookModal = ({ loadPosts }: { loadPosts: () => void }) => {
  const inputRef = useRef<any>({})
  const { closeModal } = useModal()

  return (
    <form
      id="guestbook-write-form"
      className="form"
      onSubmit={async (e) => {
        e.preventDefault()

        const name = inputRef.current.name.value.trim()
        const content = inputRef.current.content.value.trim()
        const password = inputRef.current.password.value

        if (!name) {
          alert("이름을 입력해주세요.")
          return
        }
        if (!content) {
          alert("내용을 입력해주세요.")
          return
        }
        if (password.length < 4) {
          alert("비밀번호를 4자 이상 입력해주세요.")
          return
        }


        await addDoc(collection(db, "guestbook"), {
          name,
          content,
          password,
          createdAt: serverTimestamp(),
        })

        alert("방명록 작성이 완료되었습니다.")
        closeModal()
        loadPosts()
      }}
      >
      이름
      <input ref={(r) => (inputRef.current.name = r)} placeholder="이름을 입력해주세요."/>
      내용
      <textarea ref={(r) => (inputRef.current.content = r)} placeholder="축하 메시지를 남겨주세요."/>
      비밀번호
      <input type="password" ref={(r) => (inputRef.current.password = r)} placeholder="삭제 시 사용됩니다."/>
    </form>
  )
}

const DeleteGuestBookModal = ({
  post,
  onSuccess,
}: {
  post: Post
  onSuccess: () => void
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { closeModal } = useModal()

  return (
    <form
      id="guestbook-delete-form"
      className="form"
      onSubmit={async (e) => {
        e.preventDefault()

        const inputPassword = inputRef.current?.value
        if (!inputPassword) return

        const adminSnap = await getDoc(doc(db, "config", "admin"))
        const adminPassword = adminSnap.data()?.password

        if (
          inputPassword !== post.password &&
          inputPassword !== adminPassword
        ) {
          alert("비밀번호가 일치하지 않습니다.")
          return
        }

        await deleteDoc(doc(db, "guestbook", post.id))
        alert("삭제되었습니다.")
        closeModal()
        onSuccess()
      }}
    >
      <input type="password" ref={inputRef} placeholder="비밀번호를 입력해주세요."/>
    </form>
  )
}

const PAGE_SIZE = 5

const AllGuestBookModal = ({
  onDeleted,
}: {
  onDeleted?:() => void
}) => {
  const { openModal, closeModal } = useModal()
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [page, setPage] = useState(1)

  const loadAllPosts = async () => {
    const snap = await getDocs(
      query(collection(db, "guestbook"), orderBy("createdAt", "desc")),
    )

    setAllPosts(
      snap.docs.map((d) => ({
        id: d.id,
        name: d.data().name,
        content: d.data().content,
        password: d.data().password,
        timestamp: d.data().createdAt?.seconds ?? 0,
      })),
    )
  }

  useEffect(() => {
    loadAllPosts()
  }, [])

  const totalPages = Math.ceil(allPosts.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const currentPosts = allPosts.slice(start, start + PAGE_SIZE)

  return (
    <>
      {/* 방명록 리스트 (기존 UI 그대로) */}
      {currentPosts.map((post) => (
        <div key={post.id} className="post">
          <div className="heading">
            <button
              className="close-button"
              onClick={() =>
                openModal({
                  className: "delete-guestbook-modal",
                  closeOnClickBackground: false,
                  header: <div className="title">삭제하시겠습니까?</div>,
                  content: (
                    <DeleteGuestBookModal
                      post={post}
                      onSuccess={() => {
                        loadAllPosts()
                        onDeleted?.()
                      }} // 삭제 후 reload
                    />
                  ),
                  footer: (
                    <>
                      <Button
                        buttonStyle="style2"
                        type="submit"
                        form="guestbook-delete-form"
                      >
                        삭제하기
                      </Button>
                      <Button
                        buttonStyle="style2"
                        className="bg-light-grey-color text-dark-color"
                        onClick={closeModal}
                      >
                        닫기
                      </Button>
                    </>
                  ),
                })
              }
            />
          </div>

          <div className="body">
            <div className="title">
              <div className="name">{post.name}</div>
              <div className="date">
                {dayjs.unix(post.timestamp).format("YYYY-MM-DD")}
              </div>
            </div>
            <div className="content">{post.content}</div>
          </div>
        </div>

      ))}

      {totalPages > 1 && (
        <>
          <div className="break" />
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => {
              const pageNum = i + 1
              const zeroBasedPage = i

              return (
                <div
                  key={pageNum}
                  className={`page${page === pageNum ? " current" : ""}`}
                  onClick={() => {
                    if (page === pageNum) return
                    setPage(pageNum)
                  }}
                >
                  {pageNum}
                </div>
              )
            })}
          </div>
        </>
      )}
    </>
  )
}
