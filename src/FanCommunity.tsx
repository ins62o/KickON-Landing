import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { getCommunityColumns } from "./community-messages";

export function FanCommunity() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "100px" });
  const reduced = useReducedMotion();
  const [singleColumn, setSingleColumn] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches,
  );
  const columns = getCommunityColumns(singleColumn);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const syncColumns = () => setSingleColumn(query.matches);
    syncColumns();
    query.addEventListener("change", syncColumns);
    return () => query.removeEventListener("change", syncColumns);
  }, []);

  return (
    <section id="fan-community" className="product-section community-section" aria-labelledby="community-heading">
      <header className="product-heading">
        <h2 id="community-heading">같은 팀을 응원한다는 것</h2>
        <p>29개 팀의 팬들이 각자의 공간에서<br className="mobile-break" /> 함께 이야기하고 응원합니다</p>
      </header>
      <div ref={ref} className="community-scene" data-active={inView && !reduced} role="region" aria-label="팀 팬들의 응원 TV">
        <div className="community-tv">
          <div className="community-tv-screen" tabIndex={reduced ? 0 : undefined}>
            {columns.map((column, index) => (
              <div className="community-tv-lane" key={index} style={{ "--tv-scroll-duration": `${column.length * 14}s` } as CSSProperties}>
                <div className="community-tv-scroll">
                  {[0, 1].map((copy) => (
                    <div className="community-tv-messages" key={copy} aria-hidden={copy === 1 ? true : undefined}>
                      {column.map(({ slug, name, color, message }) => (
                        <article className="message-card" key={slug} style={{ "--team-accent": color } as CSSProperties}>
                          <div className="message-team">
                            <img src={`/teams/hero/${slug}.webp`} alt="" width="32" height="32" loading="lazy" decoding="async" />
                            <span>{name}</span>
                          </div>
                          <p>{message}</p>
                        </article>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="community-tv-brand">
            <img src="/branding/kickon-on-hires.webp" alt="ON 킥온 로고" width="768" height="768" />
          </div>
        </div>
        <div className="community-tv-stand" aria-hidden="true" />
      </div>
    </section>
  );
}
