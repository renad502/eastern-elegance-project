const MESSAGES = [
  "✨ New Arrivals Are Live — Shop the Latest Eastern Collection Now!",
  "🚚 Free Delivery on Orders Above PKR 5,000 — Limited Time Offer!",
  "💫 Elegant Styles, Unmatched Quality — Shop Eastern Elegance Today!",
];

export function AnnouncementBar() {
  // Duplicate the list so the marquee loops seamlessly
  const loop = [...MESSAGES, ...MESSAGES];
  return (
    <div className="bg-gradient-brand text-cream border-b border-accent/20 overflow-hidden">
      <div className="relative flex whitespace-nowrap py-2.5">
        <div className="flex shrink-0 animate-marquee gap-16 pr-16">
          {loop.map((m, i) => (
            <span
              key={i}
              className="text-[11px] md:text-xs font-medium tracking-[0.18em] uppercase flex items-center gap-16"
            >
              {m}
              <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
        <div
          aria-hidden="true"
          className="flex shrink-0 animate-marquee gap-16 pr-16"
        >
          {loop.map((m, i) => (
            <span
              key={i}
              className="text-[11px] md:text-xs font-medium tracking-[0.18em] uppercase flex items-center gap-16"
            >
              {m}
              <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
