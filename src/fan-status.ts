export type League = "K1" | "K2";

export type TeamFan = {
  name: string;
  shortName: string;
  code: string;
  slug: string;
  league: League;
  count: number;
  color: string;
};

export type FanCounts = Readonly<Record<string, number>>;

type TeamDefinition = Omit<TeamFan, "count">;

export const TEAM_CATALOG: readonly TeamDefinition[] = [
  {
    name: "강원 FC",
    shortName: "강원",
    code: "GAN",
    slug: "gangwon",
    league: "K1",
    color: "#F47920",
  },
  {
    name: "광주 FC",
    shortName: "광주",
    code: "GWA",
    slug: "gwangju",
    league: "K1",
    color: "#F5C400",
  },
  {
    name: "김천 상무",
    shortName: "김천",
    code: "GIM",
    slug: "gimcheon",
    league: "K1",
    color: "#D71920",
  },
  {
    name: "대전 하나 시티즌",
    shortName: "대전",
    code: "DAE",
    slug: "daejeon",
    league: "K1",
    color: "#B03A68",
  },
  {
    name: "부천 FC 1995",
    shortName: "부천",
    code: "BUC",
    slug: "bucheon",
    league: "K1",
    color: "#D7193F",
  },
  {
    name: "FC 서울",
    shortName: "서울",
    code: "SEO",
    slug: "seoul",
    league: "K1",
    color: "#E31E24",
  },
  {
    name: "FC 안양",
    shortName: "안양",
    code: "ANY",
    slug: "anyang",
    league: "K1",
    color: "#6F2C91",
  },
  {
    name: "울산 HD FC",
    shortName: "울산",
    code: "ULS",
    slug: "ulsan",
    league: "K1",
    color: "#1268B3",
  },
  {
    name: "인천 유나이티드",
    shortName: "인천",
    code: "INC",
    slug: "incheon",
    league: "K1",
    color: "#1684E8",
  },
  {
    name: "전북 현대",
    shortName: "전북",
    code: "JEO",
    slug: "jeonbuk",
    league: "K1",
    color: "#0B9855",
  },
  {
    name: "제주 SK FC",
    shortName: "제주",
    code: "JEJ",
    slug: "jeju",
    league: "K1",
    color: "#F15A24",
  },
  {
    name: "포항 스틸러스",
    shortName: "포항",
    code: "POH",
    slug: "pohang",
    league: "K1",
    color: "#D71920",
  },
  {
    name: "경남 FC",
    shortName: "경남",
    code: "GNF",
    slug: "gyeongnam",
    league: "K2",
    color: "#E31E24",
  },
  {
    name: "김포 FC",
    shortName: "김포",
    code: "GMP",
    slug: "gimpo",
    league: "K2",
    color: "#007A46",
  },
  {
    name: "김해 FC",
    shortName: "김해",
    code: "GMH",
    slug: "gimhae",
    league: "K2",
    color: "#D6232B",
  },
  {
    name: "대구 FC",
    shortName: "대구",
    code: "DGU",
    slug: "daegu",
    league: "K2",
    color: "#48A9E6",
  },
  {
    name: "부산 아이파크",
    shortName: "부산",
    code: "BUS",
    slug: "busan-ipark",
    league: "K2",
    color: "#D71920",
  },
  {
    name: "서울 이랜드 FC",
    shortName: "서울E",
    code: "SEL",
    slug: "seoul-eland",
    league: "K2",
    color: "#234EA0",
  },
  {
    name: "성남 FC",
    shortName: "성남",
    code: "SNM",
    slug: "seongnam",
    league: "K2",
    color: "#454B54",
  },
  {
    name: "수원 삼성 블루윙즈",
    shortName: "수원삼성",
    code: "SSB",
    slug: "suwon-bluewings",
    league: "K2",
    color: "#2456A6",
  },
  {
    name: "수원 FC",
    shortName: "수원FC",
    code: "SFC",
    slug: "suwon-fc",
    league: "K2",
    color: "#D9272E",
  },
  {
    name: "안산 그리너스 FC",
    shortName: "안산",
    code: "ANS",
    slug: "ansan-greeners",
    league: "K2",
    color: "#1E8D53",
  },
  {
    name: "용인 FC",
    shortName: "용인",
    code: "YON",
    slug: "yongin",
    league: "K2",
    color: "#197EAE",
  },
  {
    name: "전남 드래곤즈",
    shortName: "전남",
    code: "JND",
    slug: "jeonnam",
    league: "K2",
    color: "#F2C300",
  },
  {
    name: "천안시티 FC",
    shortName: "천안",
    code: "CHN",
    slug: "cheonan-city",
    league: "K2",
    color: "#009BDF",
  },
  {
    name: "충남 아산 FC",
    shortName: "충남아산",
    code: "ASA",
    slug: "chungnam-asan",
    league: "K2",
    color: "#F1C40F",
  },
  {
    name: "충북 청주 FC",
    shortName: "충북청주",
    code: "CBJ",
    slug: "chungbuk-cheongju",
    league: "K2",
    color: "#234EA0",
  },
  {
    name: "파주 프런티어 FC",
    shortName: "파주",
    code: "PAJ",
    slug: "paju",
    league: "K2",
    color: "#3F4BC3",
  },
  {
    name: "화성 FC",
    shortName: "화성",
    code: "HWS",
    slug: "hwaseong",
    league: "K2",
    color: "#F36F21",
  },
];

export function getFanBoard(
  league: League,
  counts: FanCounts = {},
): TeamFan[] {
  return TEAM_CATALOG
    .filter((team) => team.league === league)
    .map((team) => ({
      ...team,
      count: counts[team.slug] ?? 0,
    }))
    .toSorted((firstTeam, secondTeam) => (
      secondTeam.count - firstTeam.count
      || firstTeam.name.localeCompare(secondTeam.name, "ko")
    ));
}

export function getFanSummary(
  league: League,
  counts: FanCounts = {},
) {
  const allTeams = TEAM_CATALOG.map((team) => ({
    ...team,
    count: counts[team.slug] ?? 0,
  }));
  const leagueTeams = allTeams.filter((team) => team.league === league);

  return {
    totalFans: allTeams.reduce((sum, team) => sum + team.count, 0),
    totalTeams: allTeams.filter((team) => team.count > 0).length,
    leagueFans: leagueTeams.reduce((sum, team) => sum + team.count, 0),
    leagueTeams: leagueTeams.length,
  };
}
