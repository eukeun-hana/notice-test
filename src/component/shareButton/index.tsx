import {
  BRIDE_FULLNAME,
  GROOM_FULLNAME,
  LOCATION,
  
  SHARE_ADDRESS,
  SHARE_ADDRESS_TITLE,
  
  WEDDING_DATE,
  WEDDING_DATE_FORMAT,
} from "../../const"
import ktalkIcon from "../../icons/ktalk-icon.png"
import { LazyDiv } from "../lazyDiv"
import { useKakao } from "../store"

const baseUrl = import.meta.env.BASE_URL

export const ShareButton = () => {
  const kakao = useKakao()
  return (
    <LazyDiv className="footer share-button">
      <button
        className="ktalk-share"
        onClick={() => {
          if (!kakao) {
            return
          }

          kakao.Share.sendDefault({
            objectType: "feed",
            content: {
              title: `${GROOM_FULLNAME} ❤️ ${BRIDE_FULLNAME} 결혼합니다.`,
              description:
                WEDDING_DATE.format(WEDDING_DATE_FORMAT),
              imageUrl:
                window.location.protocol +
                "//" +
                window.location.host +
                baseUrl +
                "/preview_image.png",
              link: {
                mobileWebUrl:
                  baseUrl,
                webUrl:
                  baseUrl,
              },
            },
            buttons: [
              {
                title: "알림장 보기",
                link: {
                  mobileWebUrl:
                    baseUrl,
                  webUrl:
                    baseUrl,
                },
              },
            ],
          })
        }}
      >
        <img src={ktalkIcon} alt="ktalk-icon" /> 카카오톡으로 공유하기
      </button>
    </LazyDiv>
  )
}
