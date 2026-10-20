/**
 * The Korean words on a booking screen.
 *
 * This is the most immediately useful Korean a fan outside Korea can have.
 * A ticketing page that has not been translated is not hard because the
 * language is hard — it is hard because about forty words carry the whole
 * flow, and missing one of them at the wrong moment costs the ticket.
 *
 * Grouped by where in the process you meet them, not alphabetically, because
 * the question is never "what does this word mean" in the abstract. It is
 * "what is this screen asking me".
 *
 * Romanisation is Revised Romanization, the Korean government standard.
 */

export type Word = {
  ko: string;
  roman: string;
  en: string;
  /** Why it matters here, when the plain translation is not enough. */
  note?: string;
};

export type WordGroup = {
  id: string;
  title: string;
  ko: string;
  intro: string;
  words: Word[];
};

export const wordGroups: WordGroup[] = [
  {
    id: "account",
    title: "Making an account",
    ko: "회원가입",
    intro:
      "Everything downstream depends on these matching your passport, so this is the screen to be slow on.",
    words: [
      { ko: "회원가입", roman: "hoewon-gaip", en: "Sign up" },
      { ko: "로그인", roman: "rogeu-in", en: "Log in" },
      { ko: "아이디", roman: "aidi", en: "User ID" },
      { ko: "비밀번호", roman: "bimilbeonho", en: "Password" },
      {
        ko: "본인인증",
        roman: "bonin-injeung",
        en: "Identity verification",
        note: "The single most important word on this list. On Korean-language sites this normally means verification against a Korean mobile number; the overseas-facing sites verify by passport instead.",
      },
      {
        ko: "영문 이름",
        roman: "yeongmun ireum",
        en: "Name in Latin letters",
        note: "Enter it exactly as the passport prints it, including middle names.",
      },
      { ko: "생년월일", roman: "saengnyeon-wolil", en: "Date of birth" },
      { ko: "여권번호", roman: "yeogwon-beonho", en: "Passport number" },
      { ko: "휴대폰 번호", roman: "hyudaepon beonho", en: "Mobile number" },
      { ko: "이메일", roman: "imeil", en: "Email" },
      { ko: "약관 동의", roman: "yakgwan dong-ui", en: "Agree to terms" },
    ],
  },
  {
    id: "sale",
    title: "Finding the sale",
    ko: "예매 찾기",
    intro:
      "The announcement names a platform and a time. These are the words that tell you which round you are looking at.",
    words: [
      { ko: "예매", roman: "yemae", en: "Booking / advance sale" },
      {
        ko: "선예매",
        roman: "seon-yemae",
        en: "Presale",
        note: "Usually requires a fan club membership verified in advance, on its own earlier deadline.",
      },
      { ko: "일반예매", roman: "ilban-yemae", en: "General sale" },
      { ko: "팬클럽", roman: "paenkeulleop", en: "Fan club" },
      { ko: "공연", roman: "gongyeon", en: "Performance / show" },
      { ko: "공연일", roman: "gongyeon-il", en: "Show date" },
      { ko: "공연장", roman: "gongyeonjang", en: "Venue" },
      { ko: "회차", roman: "hoecha", en: "Showing (first night, second night…)" },
      { ko: "오픈", roman: "opeun", en: "Opens" },
      { ko: "마감", roman: "magam", en: "Closes / deadline" },
      {
        ko: "매진",
        roman: "maejin",
        en: "Sold out",
        note: "Seats returned from failed payments can reappear, so a sold-out screen is not always final.",
      },
    ],
  },
  {
    id: "seats",
    title: "Choosing seats",
    ko: "좌석 선택",
    intro:
      "Korean seat maps use a grade system rather than named tiers, and the grades are not consistent between venues.",
    words: [
      { ko: "좌석", roman: "jwaseok", en: "Seat" },
      { ko: "좌석 선택", roman: "jwaseok seontaek", en: "Seat selection" },
      { ko: "등급", roman: "deunggeup", en: "Grade / tier" },
      {
        ko: "스탠딩",
        roman: "seutanding",
        en: "Standing",
        note: "Often allocated by a numbered draw rather than by where you stood in the queue.",
      },
      { ko: "지정석", roman: "jijeongseok", en: "Reserved seat" },
      { ko: "층", roman: "cheung", en: "Floor / level" },
      { ko: "구역", roman: "guyeok", en: "Section / block" },
      { ko: "열", roman: "yeol", en: "Row" },
      { ko: "번", roman: "beon", en: "Seat number" },
      { ko: "잔여석", roman: "janyeoseok", en: "Remaining seats" },
      { ko: "시야제한", roman: "siya-jehan", en: "Restricted view" },
    ],
  },
  {
    id: "pay",
    title: "Paying",
    ko: "결제",
    intro:
      "The step where an overseas card most often fails, and where the clock on your held seat is shortest.",
    words: [
      { ko: "결제", roman: "gyeolje", en: "Payment" },
      { ko: "결제수단", roman: "gyeolje-sudan", en: "Payment method" },
      { ko: "해외 발행 카드", roman: "haeoe balhaeng kadeu", en: "Overseas-issued card" },
      { ko: "신용카드", roman: "sinyong-kadeu", en: "Credit card" },
      { ko: "카드번호", roman: "kadeu-beonho", en: "Card number" },
      { ko: "유효기간", roman: "yuhyo-gigan", en: "Expiry date" },
      { ko: "총 결제금액", roman: "chong gyeolje-geumaek", en: "Total amount" },
      { ko: "수수료", roman: "susuryo", en: "Fee" },
      { ko: "결제하기", roman: "gyeolje-hagi", en: "Pay now" },
      {
        ko: "결제 실패",
        roman: "gyeolje silpae",
        en: "Payment failed",
        note: "Usually your bank or an unfinished verification rather than the card itself.",
      },
      { ko: "예매완료", roman: "yemae-wallyo", en: "Booking complete" },
    ],
  },
  {
    id: "after",
    title: "After booking",
    ko: "예매 후",
    intro:
      "Collection rules are set per show, and the document has to be the one you booked under.",
    words: [
      { ko: "예매내역", roman: "yemae-naeyeok", en: "Booking history" },
      { ko: "예매번호", roman: "yemae-beonho", en: "Booking number" },
      { ko: "티켓 수령", roman: "tiket suryeong", en: "Ticket collection" },
      { ko: "현장 수령", roman: "hyeonjang suryeong", en: "Collect at the venue" },
      { ko: "신분증", roman: "sinbunjeung", en: "Identity document" },
      { ko: "입장", roman: "ipjang", en: "Entry / doors" },
      { ko: "취소", roman: "chwiso", en: "Cancel / cancelled" },
      { ko: "취소수수료", roman: "chwiso-susuryo", en: "Cancellation fee" },
      { ko: "환불", roman: "hwanbul", en: "Refund" },
      { ko: "양도", roman: "yangdo", en: "Transfer to another person" },
      {
        ko: "부정거래",
        roman: "bujeong-georae",
        en: "Illegitimate transaction",
        note: "Covers scalping. South Korea's revised Performances Act, in force since 28 August 2026, tightened the rules around resale above the purchase price.",
      },
    ],
  },
];

export const wordCount = wordGroups.reduce((n, g) => n + g.words.length, 0);
