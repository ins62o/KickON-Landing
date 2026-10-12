import { useEffect, useState } from "react";
import { fetchLandingStats, formatMilestone, type LandingStats } from "./landing-stats";

export function HeroStats() {
  const [stats, setStats] = useState<LandingStats | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let disposed = false;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    fetchLandingStats({
      url: import.meta.env.VITE_SUPABASE_URL ?? "",
      publishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "",
    }, controller.signal)
      .then((counts) => { if (!controller.signal.aborted) setStats(counts); })
      .catch(() => { if (!disposed) setFailed(true); })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      disposed = true;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <dl className="hero-stats" aria-label="킥온 서비스 현황" aria-busy={!stats && !failed}>
      {[{ label: "사용자 수", count: stats?.users, unit: "명" }, { label: "직관 인증", count: stats?.attendances, unit: "건" }].map(({ label, count, unit }) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd aria-label={count == null ? `${label} ${failed || stats ? "현재 조회 불가" : "불러오는 중"}` : `${label} ${formatMilestone(count)} ${unit}`}>
            {count == null ? <span className="stat-unavailable">—</span> : formatMilestone(count)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
