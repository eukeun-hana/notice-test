import { useEffect, useRef, useState } from "react"
import bgmFile from "../../../public/bgm.mp3"; // src 폴더 기준
import "./index.scss"

export const BGM = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    if (!audioRef.current) return

    if (on) {
      audioRef.current.play().catch(() => {})
    } else {
      audioRef.current.pause()
    }
  }, [on])

  return (
    <div className="bgm-floating">
      <button onClick={() => setOn((v) => !v)}>
        {on ? "BGM ON" : "BGM OFF"}
      </button>

      <audio
        ref={audioRef}
        src={bgmFile} 
        loop
      />
    </div>
  )
}
