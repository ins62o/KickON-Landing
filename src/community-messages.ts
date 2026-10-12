import { teams } from "./teams";

const messages: Record<(typeof teams)[number]["slug"], string> = {
  gangwon: "강원의 오늘을 함께 응원해요",
  gwangju: "광주답게, 끝까지 함께 뛰어요",
  gimcheon: "오늘도 김천을 향한 응원은 뜨겁게",
  daejeon: "대전의 홈경기, 경기장에서 만나요",
  bucheon: "부천의 다음 순간도 함께할게요",
  seoul: "서울의 승리를 향해 목소리를 모아요",
  anyang: "안양과 함께하는 주말이 기다려져요",
  ulsan: "오늘도 함께 응원해요!",
  incheon: "다음 홈경기, 경기장에서 만나요",
  jeonbuk: "전북의 초록빛 응원을 끝까지",
  jeju: "제주의 주황빛 함성을 함께해요",
  pohang: "포항의 한 골을 함께 기다려요",
  gyeongnam: "경남과 함께 오늘도 힘차게",
  gimpo: "김포의 도전, 우리도 함께할게요",
  gimhae: "김해의 새로운 순간을 함께 응원해요",
  daegu: "대구의 하늘빛 응원을 더 크게",
  "busan-ipark": "이 순간을 함께해서 더 좋았어요",
  "seoul-eland": "서울 이랜드와 끝까지 함께해요",
  seongnam: "성남의 다음 경기도 함께할게요",
  "suwon-bluewings": "수원 삼성의 푸른 응원을 모아요",
  "suwon-fc": "수원 FC의 오늘을 함께 응원해요",
  "ansan-greeners": "안산의 초록빛 함성, 함께 외쳐요",
  yongin: "용인과 함께 만들어 갈 순간이 기대돼요",
  jeonnam: "전남의 노란 물결에 함께할게요",
  "cheonan-city": "천안의 홈경기가 기다려져요",
  "chungnam-asan": "아산을 향한 응원은 오늘도 계속",
  "chungbuk-cheongju": "청주의 다음 순간을 함께해요",
  paju: "파주의 도전을 함께 응원해요",
  hwaseong: "화성의 오늘, 경기장에서 함께해요",
};
export const communityMessages = teams.map((team) => ({ ...team, message: messages[team.slug] }));

export function getCommunityColumns(singleColumn: boolean) {
  return singleColumn ? [communityMessages] : [
    communityMessages.filter((_, index) => index % 2 === 0),
    communityMessages.filter((_, index) => index % 2 === 1),
  ];
}
