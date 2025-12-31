import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import "dayjs/locale/ko"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale("ko")

export { dayjs }
export const LOCATION = ""
export const LOCATION_ADDRESS = ""
export const SHARE_ADDRESS = LOCATION
export const SHARE_ADDRESS_TITLE = LOCATION


export const WEDDING_DATE = dayjs.tz("2026-03-15 15:00", "Asia/Seoul")
export const WEDDING_DATE_FORMAT = `YYYY년 MMMM D일 dddd A h시${WEDDING_DATE.minute() === 0 ? "" : " m분"}`

// 예식 당월 휴무일. 켈린더에 표시하기 위함.
// 예: 예식일 8월 -> 8월 15일 광복절
export const HOLIDAYS = [15]

export const BRIDE_FULLNAME = "이하나"
export const BRIDE_FIRSTNAME = "하나"
export const BRIDE_TITLE = "장녀"
export const BRIDE_FATHER = "이용기"
export const BRIDE_MOTHER = "신혜영"
export const BRIDE_INFO = [
  {
    relation: "신부",
    name: BRIDE_FULLNAME,
    phone: "010-8867-2534",
    account: "우리은행 0000000000000",
  },
  {
    relation: "신부 아버지",
    name: BRIDE_FATHER,
    phone: "010-5546-7782",
    account: "하나은행 00000000000",
  },
  {
    relation: "신부 어머니",
    name: BRIDE_MOTHER,
    phone: "010-8972-8062",
    account: "하나은행 00000000000000",
  },
]

export const GROOM_FULLNAME = "노의건"
export const GROOM_FIRSTNAME = "의건"
export const GROOM_TITLE = "장남"
export const GROOM_FATHER = "노재이"
export const GROOM_MOTHER = "박하영"
export const GROOM_INFO = [
  {
    relation: "신랑",
    name: GROOM_FULLNAME,
    phone: "010-4414-9016",
    account: "하나은행 00000000000000",
  },
  {
    relation: "신랑 아버지",
    name: GROOM_FATHER,
    phone: "010-2854-0419",
    account: "신한은행 000000000000",
  },
  {
    relation: "신랑 어머니",
    name: GROOM_MOTHER,
    phone: "010-5116-9016",
    account: "국민은행 000000000000",
  },
]
