import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";

interface GuestBookItem {
  id: string;
  name: string;
  message: string;
  password: string;
  createdAt?: any;
}

export default function GuestBook() {
  const [guestbooks, setGuestbooks] = useState<GuestBookItem[]>([]);
  const [openForm, setOpenForm] = useState(false);

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");

  const [deletePassword, setDeletePassword] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  /** 방명록 불러오기 */
  const fetchGuestbooks = async () => {
    const q = query(
      collection(db, "guestbook"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);

    const data: GuestBookItem[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<GuestBookItem, "id">),
    }));

    setGuestbooks(data);
  };

  useEffect(() => {
    fetchGuestbooks();
  }, []);

  /** 방명록 저장 */
  const handleSubmit = async () => {
    if (!name || !message || !password) {
      alert("이름, 내용, 비밀번호를 모두 입력해주세요.");
      return;
    }

    const newItem = {
      name,
      message,
      password,
      createdAt: serverTimestamp(),
    };

    // ✅ UX 유지: 먼저 화면에 추가
    setGuestbooks((prev) => [
      { id: Math.random().toString(), ...newItem },
      ...prev,
    ]);

    // 입력창 초기화
    setName("");
    setMessage("");
    setPassword("");
    setOpenForm(false);

    try {
      await addDoc(collection(db, "guestbook"), newItem);
      fetchGuestbooks(); // 실제 ID 동기화
    } catch (e) {
      console.error(e);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  /** 방명록 삭제 */
  const handleDelete = async (item: GuestBookItem) => {
    if (!deletePassword) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    if (deletePassword !== item.password) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await deleteDoc(doc(db, "guestbook", item.id));
      setGuestbooks((prev) => prev.filter((g) => g.id !== item.id));
      setDeletePassword("");
      setDeleteTargetId(null);
    } catch (e) {
      console.error(e);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="guestbook-wrapper">
      <h2>방명록</h2>

      {/* 방명록 남기기 버튼 */}
      <button
        className="guestbook-open-btn"
        onClick={() => setOpenForm((prev) => !prev)}
      >
        방명록 남기기
      </button>

      {/* 작성 폼 */}
      {openForm && (
        <div className="guestbook-form">
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            placeholder="내용"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSubmit}>저장</button>
        </div>
      )}

      {/* 방명록 목록 */}
      <ul className="guestbook-list">
        {guestbooks.map((item) => (
          <li key={item.id} className="guestbook-item">
            <div className="guestbook-content">
              <strong>{item.name}</strong>
              <p>{item.message}</p>
            </div>

            {/* 삭제 영역 */}
            {deleteTargetId === item.id ? (
              <div className="guestbook-delete">
                <input
                  type="password"
                  placeholder="비밀번호"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                />
                <button onClick={() => handleDelete(item)}>삭제</button>
                <button
                  onClick={() => {
                    setDeleteTargetId(null);
                    setDeletePassword("");
                  }}
                >
                  취소
                </button>
              </div>
            ) : (
              <button
                className="guestbook-delete-btn"
                onClick={() => setDeleteTargetId(item.id)}
              >
                삭제
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
