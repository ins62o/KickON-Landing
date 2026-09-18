import { useEffect, useMemo, useState } from "react";
import "./App.css";
import {
  FaApple,
  FaGooglePlay,
  FaChevronRight,
} from "react-icons/fa";

type League = "K1" | "K2";

type TeamFan = {
  name: string;
  shortName: string;
  code: string;
  league: League;
  count: number;
  color: string;
};

/**
 * 현재는 랜딩페이지 UI 확인용 데이터.
 * 추후 Supabase 응원팀별 가입자 수 데이터로 교체.
 */
const TEAM_FANS: TeamFan[] = [
  // K리그1 - 12팀
  {
    name: "강원 FC",
    shortName: "강원",
    code: "GAN",
    league: "K1",
    count: 8,
    color: "#F47920",
  },
  {
    name: "광주 FC",
    shortName: "광주",
    code: "KWJ",
    league: "K1",
    count: 6,
    color: "#F5C400",
  },
  {
    name: "김천상무",
    shortName: "김천",
    code: "GIM",
    league: "K1",
    count: 4,
    color: "#D71920",
  },
  {
    name: "대전하나시티즌",
    shortName: "대전",
    code: "DAE",
    league: "K1",
    count: 9,
    color: "#14745D",
  },
  {
    name: "부천 FC",
    shortName: "부천",
    code: "BCN",
    league: "K1",
    count: 5,
    color: "#D7193F",
  },
  {
    name: "FC 서울",
    shortName: "서울",
    code: "SEL",
    league: "K1",
    count: 12,
    color: "#E31E24",
  },
  {
    name: "FC 안양",
    shortName: "안양",
    code: "AYN",
    league: "K1",
    count: 7,
    color: "#6F2C91",
  },
  {
    name: "울산 HD",
    shortName: "울산",
    code: "USN",
    league: "K1",
    count: 10,
    color: "#1268B3",
  },
  {
    name: "인천유나이티드",
    shortName: "인천",
    code: "ICN",
    league: "K1",
    count: 15,
    color: "#1684E8",
  },
  {
    name: "전북현대",
    shortName: "전북",
    code: "JEO",
    league: "K1",
    count: 11,
    color: "#0B9855",
  },
  {
    name: "제주 SK",
    shortName: "제주",
    code: "CJU",
    league: "K1",
    count: 6,
    color: "#F15A24",
  },
  {
    name: "포항스틸러스",
    shortName: "포항",
    code: "KPO",
    league: "K1",
    count: 9,
    color: "#D71920",
  },

  // K리그2 - 17팀
  {
    name: "경남 FC",
    shortName: "경남",
    code: "GNM",
    league: "K2",
    count: 4,
    color: "#E31E24",
  },
  {
    name: "김포 FC",
    shortName: "김포",
    code: "GMP",
    league: "K2",
    count: 3,
    color: "#F3C400",
  },
  {
    name: "김해 FC",
    shortName: "김해",
    code: "GHA",
    league: "K2",
    count: 2,
    color: "#F5A623",
  },
  {
    name: "대구 FC",
    shortName: "대구",
    code: "DGU",
    league: "K2",
    count: 7,
    color: "#48A9E6",
  },
  {
    name: "부산아이파크",
    shortName: "부산",
    code: "BSN",
    league: "K2",
    count: 5,
    color: "#D71920",
  },
  {
    name: "서울이랜드",
    shortName: "서울E",
    code: "SEO",
    league: "K2",
    count: 5,
    color: "#234EA0",
  },
  {
    name: "성남 FC",
    shortName: "성남",
    code: "SNM",
    league: "K2",
    count: 6,
    color: "#222222",
  },
  {
    name: "수원삼성",
    shortName: "수원삼성",
    code: "SSB",
    league: "K2",
    count: 8,
    color: "#2456A6",
  },
  {
    name: "수원 FC",
    shortName: "수원FC",
    code: "SWF",
    league: "K2",
    count: 5,
    color: "#D9272E",
  },
  {
    name: "안산그리너스",
    shortName: "안산",
    code: "ASN",
    league: "K2",
    count: 2,
    color: "#1E8D53",
  },
  {
    name: "용인 FC",
    shortName: "용인",
    code: "YON",
    league: "K2",
    count: 2,
    color: "#29459B",
  },
  {
    name: "전남드래곤즈",
    shortName: "전남",
    code: "JNM",
    league: "K2",
    count: 4,
    color: "#F2C300",
  },
  {
    name: "천안시티 FC",
    shortName: "천안",
    code: "CAN",
    league: "K2",
    count: 3,
    color: "#174A94",
  },
  {
    name: "충남아산 FC",
    shortName: "충남아산",
    code: "ASA",
    league: "K2",
    count: 3,
    color: "#005BAC",
  },
  {
    name: "충북청주 FC",
    shortName: "충북청주",
    code: "CJC",
    league: "K2",
    count: 3,
    color: "#234EA0",
  },
  {
    name: "파주프론티어",
    shortName: "파주",
    code: "PAJ",
    league: "K2",
    count: 2,
    color: "#E15C24",
  },
  {
    name: "화성 FC",
    shortName: "화성",
    code: "HWA",
    league: "K2",
    count: 3,
    color: "#F36F21",
  },
];

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 10h18" />
  </svg>
);

const PinIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
    <path d="M10 21h4" />
  </svg>
);

const ChartIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
);

const SoccerBallIcon = () => (
  <svg viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="26" />
    <path d="m32 18 10 7-4 12H26l-4-12 10-7Z" />
    <path d="m22 25-10-2M42 25l10-2M26 37l-7 10M38 37l7 10M32 18V7" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

function FanTeamCard({
  team,
  maxCount,
  rank,
}: {
  team: TeamFan;
  maxCount: number;
  rank: number;
}) {
  const percentage =
    maxCount === 0 ? 0 : (team.count / maxCount) * 100;

  return (
    <div className="fan-team-card">
      <div
        className="fan-team-bg"
        style={{
          width: `${percentage}%`,
          background: `linear-gradient(
            90deg,
            ${team.color}24,
            transparent
          )`,
        }}
      />

      <span className="fan-rank">{rank}</span>

      <div
        className="fan-team-emblem"
        style={{
          borderColor: `${team.color}66`,
          background: `linear-gradient(
            135deg,
            ${team.color},
            #09131e
          )`,
        }}
      >
        {team.code}
      </div>

      <div className="fan-team-info">
        <strong>{team.name}</strong>

        <div className="fan-progress">
          <span
            style={{
              width: `${percentage}%`,
              background: team.color,
            }}
          />
        </div>
      </div>

      <div className="fan-count">
        <strong>{team.count}</strong>
        <span>명</span>
      </div>
    </div>
  );
}

function FanStatusModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [league, setLeague] = useState<League>("K1");

  const k1Teams = useMemo(
    () =>
      TEAM_FANS.filter((team) => team.league === "K1").sort(
        (a, b) => b.count - a.count,
      ),
    [],
  );

  const k2Teams = useMemo(
    () =>
      TEAM_FANS.filter((team) => team.league === "K2").sort(
        (a, b) => b.count - a.count,
      ),
    [],
  );

  const currentTeams =
    league === "K1" ? k1Teams : k2Teams;

  const currentTotal = currentTeams.reduce(
    (sum, team) => sum + team.count,
    0,
  );

  const totalFans = TEAM_FANS.reduce(
    (sum, team) => sum + team.count,
    0,
  );

  const maxCount = Math.max(
    ...currentTeams.map((team) => team.count),
  );

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fan-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="fan-modal">
        <div className="fan-modal-header">
          <div>
            <span className="fan-modal-label">
              KICKON FAN BOARD
            </span>

            <h2>킥온에는 어떤 팬들이 모여있을까요?</h2>

            <p>
              팀을 응원하는 킥온 팬들을 확인해보세요.
            </p>
          </div>

          <button
            className="fan-modal-close"
            type="button"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="fan-summary">
          <div>
            <span>함께하는 팬</span>
            <strong>
              {totalFans}
              <small>명</small>
            </strong>
          </div>

          <div>
            <span>함께하는 팀</span>
            <strong>
              29
              <small>팀</small>
            </strong>
          </div>

          <div>
            <span>현재 리그 팬</span>
            <strong>
              {currentTotal}
              <small>명</small>
            </strong>
          </div>
        </div>

        <div className="league-tabs">
          <button
            className={league === "K1" ? "active" : ""}
            type="button"
            onClick={() => setLeague("K1")}
          >
            <span>K리그1</span>
            <small>12팀</small>
          </button>

          <button
            className={league === "K2" ? "active" : ""}
            type="button"
            onClick={() => setLeague("K2")}
          >
            <span>K리그2</span>
            <small>17팀</small>
          </button>
        </div>

        <div className="fan-modal-content">
          <div className="fan-list-header">
            <div>
              <span
                className={`league-dot ${
                  league === "K1" ? "k1" : "k2"
                }`}
              />

              <strong>
                {league === "K1"
                  ? "K리그1 팬 현황"
                  : "K리그2 팬 현황"}
              </strong>
            </div>

            <span>
              {currentTeams.length}팀 · {currentTotal}명
            </span>
          </div>

          <div className="fan-team-grid">
            {currentTeams.map((team, index) => (
              <FanTeamCard
                key={team.code}
                team={team}
                maxCount={maxCount}
                rank={index + 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FanStatusButton({
  onClick,
}: {
  onClick: () => void;
}) {
  const totalFans = TEAM_FANS.reduce(
    (sum, team) => sum + team.count,
    0,
  );

  return (
    <button
      className="fan-status-button"
      type="button"
      onClick={onClick}
    >
      <span className="fan-live-dot" />

      <span>팬 현황</span>

      <small>{totalFans}명</small>

      <FaChevronRight />
    </button>
  );
}

function MatchCard() {
  return (
    <div className="app-match-card">
      <div className="app-match-header">
        <span>K리그1</span>

        <span className="live">
          <i />
          LIVE
        </span>
      </div>

      <p className="app-match-date">
        09.18 금 · 19:30
      </p>

      <div className="app-match-teams">
        <div className="app-team">
          <div className="app-emblem blue">
            ICN
          </div>

          <strong>인천</strong>
        </div>

        <div className="app-score">
          <small>후반 67'</small>
          <strong>2 : 1</strong>
        </div>

        <div className="app-team">
          <div className="app-emblem red">
            SEL
          </div>

          <strong>서울</strong>
        </div>
      </div>

      <div className="app-goal">
        <span>⚽</span>

        <div>
          <strong>인천 골!</strong>
          <small>후반 22분</small>
        </div>

        <b>2 : 1</b>
      </div>
    </div>
  );
}

function PhonePreview() {
  return (
    <div className="phone-area">
      <div className="phone-glow" />

      <div className="floating-alert">
        <div className="floating-alert-icon">
          <SoccerBallIcon />
        </div>

        <div className="floating-alert-copy">
          <strong>인천 골!</strong>
          <span>
            후반 22분 · 현재 스코어 2 : 1
          </span>
        </div>

        <small>지금</small>
      </div>

      <div className="phone">
        <div className="phone-island" />

        <div className="phone-content">
          <div className="phone-status">
            <strong>9:41</strong>
            <span>● ● ●</span>
          </div>

          <div className="phone-header">
            <div>
              <span>MY TEAM</span>
              <h3>인천 유나이티드</h3>
            </div>

            <button>
              <BellIcon />
              <i />
            </button>
          </div>

          <div className="matchday-message">
            <span>⚽</span>
            오늘은 경기가 있는 날이에요.
          </div>

          <div className="rank-box">
            <div>
              <strong>3위</strong>
              <span>현재 순위</span>
            </div>

            <div>
              <strong>15</strong>
              <span>승</span>
            </div>

            <div>
              <strong>7</strong>
              <span>무</span>
            </div>

            <div>
              <strong>6</strong>
              <span>패</span>
            </div>
          </div>

          <div className="phone-section-title">
            <strong>오늘 경기</strong>
            <span>경기 상세 ›</span>
          </div>

          <MatchCard />

          <div className="phone-nav">
            <div className="active">
              <CalendarIcon />
              <span>경기</span>
            </div>

            <div>
              <PinIcon />
              <span>직관</span>
            </div>

            <div>
              <ChartIcon />
              <span>기록</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isFanModalOpen, setIsFanModalOpen] =
    useState(false);

  return (
    <div className="landing">
      <style>{`
        /* =====================================================
           Header
        ====================================================== */

        .fan-status-button {
          height: 42px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          gap: 9px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.045);
          color: #ffffff;
          cursor: pointer;
          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;
        }

        .fan-status-button:hover {
          background: rgba(255, 255, 255, 0.075);
          border-color: rgba(45, 156, 245, 0.3);
          transform: translateY(-1px);
        }

        .fan-status-button > span:nth-child(2) {
          font-size: 12px;
          font-weight: 700;
        }

        .fan-status-button small {
          color: #6f8195;
          font-size: 10px;
        }

        .fan-status-button svg {
          width: 9px;
          height: 9px;
          margin-left: 2px;
          color: #627489;
        }

        .fan-live-dot {
          width: 7px;
          height: 7px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #2d9cf5;
          box-shadow:
            0 0 0 4px rgba(45, 156, 245, 0.1),
            0 0 12px rgba(45, 156, 245, 0.5);
        }

        /* =====================================================
           Hero 크게
        ====================================================== */

        .hero {
          min-height: 970px !important;
        }

        .hero-inner {
          min-height: 970px !important;
          padding-top: 135px !important;
          padding-bottom: 70px;
        }

        .hero h1 {
          font-size: clamp(
            60px,
            5.8vw,
            86px
          ) !important;

          line-height: 1.08 !important;
          letter-spacing: -4.5px !important;
        }

        .hero-description {
          margin-top: 36px !important;
          font-size: 18px !important;
          line-height: 1.85 !important;
        }

        .store-buttons {
          margin-top: 40px !important;
        }

        .store-button {
          min-width: 184px !important;
          height: 60px !important;
        }

        .store-button > svg {
          width: 27px;
          height: 27px;
          flex-shrink: 0;
          stroke: none;
          fill: currentColor;
        }

        /* =====================================================
           Fan Modal
        ====================================================== */

        .fan-modal-backdrop {
          position: fixed;
          z-index: 9999;
          inset: 0;
          padding: 32px 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(3, 8, 14, 0.82);
          backdrop-filter: blur(10px);
        }

        .fan-modal {
          width: min(100%, 820px);
          max-height: calc(100vh - 64px);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 26px;
          background:
            linear-gradient(
              145deg,
              #111e2d 0%,
              #0c1622 100%
            );
          box-shadow:
            0 40px 120px rgba(0, 0, 0, 0.6);
        }

        .fan-modal-header {
          padding: 27px 28px 21px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .fan-modal-label {
          color: #328fdf;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.7px;
        }

        .fan-modal-header h2 {
          margin: 7px 0 0;
          color: white;
          font-size: 24px;
          letter-spacing: -1px;
        }

        .fan-modal-header p {
          margin: 8px 0 0;
          color: #718298;
          font-size: 12px;
        }

        .fan-modal-close {
          width: 38px;
          height: 38px;
          padding: 10px;
          flex-shrink: 0;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.04);
          color: #8191a4;
          cursor: pointer;
        }

        .fan-summary {
          margin: 0 28px;
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 8px;
        }

        .fan-summary > div {
          padding: 13px 15px;
          border: 1px solid rgba(255, 255, 255, 0.055);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.025);
        }

        .fan-summary span {
          display: block;
          color: #607287;
          font-size: 9px;
        }

        .fan-summary strong {
          display: block;
          margin-top: 5px;
          color: white;
          font-size: 20px;
        }

        .fan-summary small {
          margin-left: 3px;
          color: #6f8195;
          font-size: 9px;
        }

        /* League Tabs */

        .league-tabs {
          margin: 21px 28px 0;
          padding: 4px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
          border-radius: 13px;
          background: #09131e;
        }

        .league-tabs button {
          position: relative;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          border-radius: 10px;
          background: transparent;
          color: #65768a;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .league-tabs button span {
          font-size: 13px;
          font-weight: 800;
        }

        .league-tabs button small {
          padding: 3px 7px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.04);
          color: #56677b;
          font-size: 8px;
        }

        .league-tabs button.active {
          background:
            linear-gradient(
              135deg,
              rgba(0, 106, 204, 0.18),
              rgba(0, 106, 204, 0.08)
            );
          color: #ffffff;
          box-shadow:
            inset 0 0 0 1px
            rgba(45, 156, 245, 0.18);
        }

        .league-tabs button.active::after {
          position: absolute;
          right: 22%;
          bottom: 0;
          left: 22%;
          height: 2px;
          border-radius: 20px;
          background: #2d9cf5;
          content: "";
          box-shadow:
            0 0 10px rgba(45, 156, 245, 0.5);
        }

        .league-tabs button.active small {
          background: rgba(45, 156, 245, 0.11);
          color: #65b6fa;
        }

        .fan-modal-content {
          margin-top: 20px;
          padding: 0 28px 28px;
          overflow-y: auto;
        }

        .fan-list-header {
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .fan-list-header > div {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .fan-list-header strong {
          font-size: 12px;
          color: #dfe8f1;
        }

        .fan-list-header > span {
          color: #5c6d82;
          font-size: 9px;
        }

        .league-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .league-dot.k1 {
          background: #2d9cf5;
          box-shadow:
            0 0 10px rgba(45, 156, 245, 0.6);
        }

        .league-dot.k2 {
          background: #42bd8a;
          box-shadow:
            0 0 10px rgba(66, 189, 138, 0.5);
        }

        .fan-team-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 8px;
        }

        .fan-team-card {
          position: relative;
          min-width: 0;
          min-height: 62px;
          overflow: hidden;
          padding: 0 14px;
          display: flex;
          align-items: center;
          gap: 11px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          background: #121f2e;
        }

        .fan-team-bg {
          position: absolute;
          inset: 0 auto 0 0;
          pointer-events: none;
        }

        .fan-rank {
          position: relative;
          z-index: 1;
          width: 15px;
          flex-shrink: 0;
          color: #55687c;
          font-size: 9px;
          font-weight: 800;
          text-align: center;
        }

        .fan-team-emblem {
          position: relative;
          z-index: 1;
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border: 1px solid;
          border-radius: 50%;
          color: white;
          font-size: 7px;
          font-weight: 900;
        }

        .fan-team-info {
          position: relative;
          z-index: 1;
          min-width: 0;
          flex: 1;
        }

        .fan-team-info strong {
          display: block;
          overflow: hidden;
          color: #eaf0f6;
          font-size: 11px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .fan-progress {
          height: 3px;
          margin-top: 7px;
          overflow: hidden;
          border-radius: 99px;
          background: rgba(255, 255, 255, 0.055);
        }

        .fan-progress span {
          display: block;
          height: 100%;
          border-radius: inherit;
        }

        .fan-count {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: baseline;
          gap: 2px;
        }

        .fan-count strong {
          color: #ffffff;
          font-size: 14px;
        }

        .fan-count span {
          color: #65778b;
          font-size: 8px;
        }

        @media (max-width: 720px) {
          .hero {
            min-height: auto !important;
          }

          .hero-inner {
            min-height: auto !important;
            padding-top: 145px !important;
            padding-bottom: 90px !important;
          }

          .hero h1 {
            font-size: 50px !important;
            letter-spacing: -3px !important;
          }

          .fan-modal-backdrop {
            padding: 12px;
          }

          .fan-modal {
            max-height: calc(100vh - 24px);
            border-radius: 20px;
          }

          .fan-modal-header {
            padding:
              22px 19px 18px;
          }

          .fan-modal-header h2 {
            font-size: 19px;
          }

          .fan-summary {
            margin: 0 19px;
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }

          .fan-summary > div {
            padding: 11px 9px;
          }

          .fan-summary strong {
            font-size: 16px;
          }

          .league-tabs {
            margin:
              18px 19px 0;
          }

          .fan-modal-content {
            padding:
              0 19px 24px;
          }

          .fan-team-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .hero h1 {
            font-size: 43px !important;
          }

          .header-inner > a {
            font-size: 11px !important;
          }

          .fan-status-button {
            padding: 0 12px;
          }

          .fan-status-button small {
            display: none;
          }
        }
      `}</style>

      <header className="header">
        <div className="container header-inner">
          <a
            href="#top"
            style={{
              color: "#7c8c9e",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "-0.2px",
            }}
          >
            모두를 위한 K리그 커뮤니티
          </a>

          <FanStatusButton
            onClick={() =>
              setIsFanModalOpen(true)
            }
          />
        </div>
      </header>

      {isFanModalOpen && (
        <FanStatusModal
          onClose={() =>
            setIsFanModalOpen(false)
          }
        />
      )}

      <main>
        <section className="hero" id="top">
          <div className="hero-lines">
            <span />
            <span />
          </div>

          <div className="container hero-inner">
            <div className="hero-copy">
              <h1>
                모두를 위한
                <br />
                K리그 커뮤니티
              </h1>

              <p className="hero-description">
                경기 정보부터 직관 기록,
                <br />
                팬들과 나누는 이야기까지.
                <br />
                K리그를 즐기는 모든 순간을
                킥온에서 만나보세요.
              </p>

              <div className="store-buttons">
                <button
                  className="store-button"
                  type="button"
                >
                  <FaApple />

                  <span className="store-copy">
                    <small>
                      Download on the
                    </small>

                    <strong>
                      App Store
                    </strong>
                  </span>
                </button>

                <button
                  className="store-button"
                  type="button"
                >
                  <FaGooglePlay />

                  <span className="store-copy">
                    <small>
                      GET IT ON
                    </small>

                    <strong>
                      Google Play
                    </strong>
                  </span>
                </button>
              </div>
            </div>

            <div className="hero-preview">
              <PhonePreview />
            </div>
          </div>
        </section>

        <section className="features section">
          <div className="container">
            <div className="section-title">
              <span>
                ALL ABOUT YOUR MATCH DAY
              </span>

              <h2>
                경기 전부터 경기 후까지,
                <br />
                <em>
                  팬의 하루를 하나로.
                </em>
              </h2>

              <p>
                경기 정보부터 직관의 순간까지.
                <br className="mobile-only" />
                K리그를 즐기는 새로운 방법을
                킥온에서 만나보세요.
              </p>
            </div>

            <div className="feature-grid">
              <article className="feature-card">
                <div className="feature-top">
                  <span className="feature-number">
                    01
                  </span>

                  <div className="feature-icon">
                    <CalendarIcon />
                  </div>
                </div>

                <h3>
                  오늘의 경기를 한눈에
                </h3>

                <p>
                  응원팀의 일정과 순위,
                  경기 정보를 한곳에서
                  빠르게 확인하세요.
                </p>

                <div className="schedule-demo">
                  <div className="schedule-label">
                    TODAY
                  </div>

                  <div className="schedule-row">
                    <div>
                      <span className="small-emblem blue">
                        ICN
                      </span>

                      <strong>
                        인천
                      </strong>
                    </div>

                    <b>19:30</b>

                    <div>
                      <span className="small-emblem red">
                        SEL
                      </span>

                      <strong>
                        서울
                      </strong>
                    </div>
                  </div>

                  <span className="stadium">
                    인천축구전용경기장
                  </span>
                </div>
              </article>

              <article className="feature-card highlighted">
                <div className="feature-top">
                  <span className="feature-number">
                    02
                  </span>

                  <div className="feature-icon">
                    <BellIcon />
                  </div>
                </div>

                <h3>
                  놓치지 않는 경기 순간
                </h3>

                <p>
                  라인업 공개와 득점 등
                  중요한 경기 소식을
                  빠르게 확인하세요.
                </p>

                <div className="notification-demo">
                  <div className="notification-ball">
                    <SoccerBallIcon />
                  </div>

                  <div>
                    <small>
                      KICKON
                    </small>

                    <strong>
                      인천 골!
                    </strong>

                    <span>
                      후반 22분 · 현재 스코어
                      2 : 1
                    </span>
                  </div>

                  <time>
                    지금
                  </time>
                </div>
              </article>

              <article className="feature-card">
                <div className="feature-top">
                  <span className="feature-number">
                    03
                  </span>

                  <div className="feature-icon">
                    <PinIcon />
                  </div>
                </div>

                <h3>
                  내 직관을 기록하다
                </h3>

                <p>
                  경기장에서 직관을 인증하고
                  결과와 추억을 나만의 축구
                  기록으로 남겨보세요.
                </p>

                <div className="record-demo">
                  <div className="record-demo-header">
                    <span>
                      2026 SEASON
                    </span>

                    <strong>
                      직관 기록
                    </strong>
                  </div>

                  <div className="record-demo-stats">
                    <div>
                      <strong>12</strong>
                      <span>경기</span>
                    </div>

                    <div>
                      <strong>7</strong>
                      <span>승</span>
                    </div>

                    <div>
                      <strong>3</strong>
                      <span>무</span>
                    </div>

                    <div>
                      <strong>2</strong>
                      <span>패</span>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="record-section section">
          <div className="container record-inner">
            <div className="record-copy">
              <span className="section-label">
                YOUR FOOTBALL MEMORY
              </span>

              <h2>
                오늘의 함성을
                <br />

                <em>
                  기록으로 남기세요.
                </em>
              </h2>

              <p>
                경기장에 도착하면 직관을
                인증하고,
                <br />
                경기 결과와 함께 나만의 시즌
                기록을 만들어보세요.
              </p>

              <div className="record-list">
                <div>
                  <span>
                    <PinIcon />
                  </span>

                  <div>
                    <strong>
                      경기장에서 직관 인증
                    </strong>

                    <p>
                      경기장 위치를 기반으로
                      간편하게 인증
                    </p>
                  </div>
                </div>

                <div>
                  <span>
                    <ChartIcon />
                  </span>

                  <div>
                    <strong>
                      승 · 무 · 패 직관 기록
                    </strong>

                    <p>
                      내가 함께한 경기 결과를
                      시즌별로 확인
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="season-card">
              <div className="season-card-header">
                <div>
                  <span>
                    MY KICKON
                  </span>

                  <strong>
                    2026 직관 기록
                  </strong>
                </div>

                <span className="streak">
                  3연승
                </span>
              </div>

              <div className="season-total">
                <span>
                  이번 시즌
                </span>

                <strong>
                  12
                  <small>
                    경기
                  </small>
                </strong>
              </div>

              <div className="season-stats">
                <div>
                  <strong>7</strong>
                  <span>승</span>
                </div>

                <div>
                  <strong>3</strong>
                  <span>무</span>
                </div>

                <div>
                  <strong>2</strong>
                  <span>패</span>
                </div>
              </div>

              <div className="rate-row">
                <span>
                  직관 승률
                </span>

                <strong>
                  58%
                </strong>
              </div>

              <div className="rate-bar">
                <span />
              </div>

              <div className="latest-record">
                <span>
                  최근 직관
                </span>

                <div>
                  <strong>
                    인천
                  </strong>

                  <b>
                    2 : 1
                  </b>

                  <strong>
                    서울
                  </strong>
                </div>

                <small>
                  09.18 · 인천축구전용경기장
                </small>
              </div>
            </div>
          </div>
        </section>

        <section className="download-section">
          <div className="download-glow" />

          <div className="container download-inner">
            <span className="download-brand">
              KICKON
            </span>

            <h2>
              K리그를 즐기는 순간,
              <br />

              <em>
                킥온과 함께.
              </em>
            </h2>

            <p>
              경기 정보를 확인하고,
              <br />
              직관을 기록하고 팬들과 함께
              이야기하세요.
            </p>

            <div className="store-buttons centered">
              <button
                className="store-button light"
                type="button"
              >
                <FaApple />

                <span className="store-copy">
                  <small>
                    Download on the
                  </small>

                  <strong>
                    App Store
                  </strong>
                </span>
              </button>

              <button
                className="store-button light"
                type="button"
              >
                <FaGooglePlay />

                <span className="store-copy">
                  <small>
                    GET IT ON
                  </small>

                  <strong>
                    Google Play
                  </strong>
                </span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <p
              style={{
                margin: 0,
                color: "#8998a9",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              모두를 위한 K리그 커뮤니티
            </p>
          </div>

          <div className="footer-links">
            <a href="/">
              이용약관
            </a>

            <a href="/">
              개인정보처리방침
            </a>

            <a href="/">
              문의하기
            </a>
          </div>

          <p className="copyright">
            © 2026 KICKON. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;