import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { teams } from "./teams";

export function MarqueeScroller({ className }: { className?: string }) {
  return (
    <div
      role="region"
      aria-label="킥온에서 만나는 K리그 29개 팀"
      tabIndex={0}
      className={twMerge(clsx("logo-marquee mt-10 mx-auto w-full max-w-[1400px] overflow-hidden py-2 outline-offset-4 focus-visible:outline-2 focus-visible:outline-slate-500", className))}
      style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}
    >
      <div className="marquee-track flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="marquee-copy flex shrink-0 gap-4 pr-4" role="list" aria-hidden={copy === 1 ? true : undefined}>
            {teams.map(({ slug, name, color }) => (
              <div key={slug} role="listitem" title={name} className="w-40 shrink-0 text-center">
                <div className="group relative h-24 w-40 flex items-center justify-center rounded-full bg-white border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all overflow-hidden">
                  <div
                    className="absolute inset-0 scale-150 opacity-0 transition-[transform,opacity] duration-500 ease-out group-hover:scale-100 group-hover:opacity-100"
                    style={{ background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 65%, #0a1b33))` }}
                    aria-hidden="true"
                  />
                  <img src={`/teams/hero/${slug}.webp`} alt={copy === 0 ? `${name} 엠블럼` : ""} width="160" height="160" decoding="async" className="relative z-10 h-14 w-14 object-contain transition-transform duration-300 group-hover:scale-110" />
                </div>
                <p className="mt-3 whitespace-nowrap text-[12px] font-medium leading-5 text-[#0a1b33]">{name}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
