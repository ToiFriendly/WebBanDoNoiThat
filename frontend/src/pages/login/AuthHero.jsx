export default function AuthHero({ content }) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-[#d8c4ae] bg-[linear-gradient(160deg,rgba(255,252,247,0.86),rgba(245,235,222,0.72))] p-6 shadow-[0_24px_80px_rgba(76,51,36,0.12)] backdrop-blur md:p-10 lg:p-12">
      <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-[rgba(250,192,106,0.18)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-52 w-52 rounded-full bg-[rgba(161,98,7,0.08)] blur-3xl" />

      <div className="relative flex h-full flex-col">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8c5f3f] md:text-[0.92rem]">
          {content.eyebrow}
        </p>

        <h1 className="mt-7 max-w-[8.4ch] text-[clamp(3.2rem,7vw,5.9rem)] leading-[0.9] font-semibold tracking-[-0.055em] text-[#2f241f]">
          {content.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <div className="mt-7 max-w-[28rem] space-y-2 text-base leading-8 text-[#5d483f] md:text-lg">
          {content.description.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {content.cards.map((card) => (
            <div
              key={card.title}
              className="rounded-[24px] border border-[#d8c4ae] bg-white/66 px-6 py-5"
            >
              <h2 className="text-lg font-bold text-[#2f241f] md:text-xl">
                {card.title}
              </h2>
              <div className="mt-3 space-y-1 text-sm leading-7 text-[#6a544a] md:text-[15px]">
                {card.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
