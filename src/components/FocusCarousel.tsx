import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import imgWomen from "../assets/images/buk1.webp";
import imgWomen2 from "../assets/images/buk3.webp";
import imgWomen3 from "../assets/images/buk2.webp";

type FocusItem = {
  title: string;
  text: string;
  image: string;
  to?: string;
};

export default function FocusCarousel() {
  const FOCUS: FocusItem[] = useMemo(
    () => [
      {
        title: "Cultural Identity & Heritage",
        text: "Be Afrique is rooted in African heritage and identity. The brand exists to connect Africans in the diaspora with their culture and traditions through fashion, while inviting the world to celebrate the artistry of African design. Clothing is positioned as a reflection of identity, culture, and values, not just fabric.",
        image: imgWomen,
        to: "/what-we-do#women",
      },
      {
        title: "Sustainability & Eco-Friendly Practices",
        text: "Sustainability is at the heart of the brand. Be Afrique emphasizes eco-friendly, ethical, and sustainable design practices. The mission goes beyond aesthetics fashion should “feel good” on the wearer and for the planet.",
        image: imgWomen2,
        to: "/what-we-do#mentorship",
      },
      {
        title: "Empowerment & Movement",
        text: "Not just a label but a movement. Empowering women, supporting artisans, building communities, and creating social impact while celebrating cultural beauty globally.",
        image: imgWomen3,
        to: "/about#values",
      },
    ],
    []
  );

  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);

  // sync active dot with scroll
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const first = el.firstElementChild as HTMLElement | null;
      if (!first) return;
      const gap = 16; // gap-4
      const w = first.clientWidth + gap;
      const idx = Math.round(el.scrollLeft / w);
      setActive(Math.min(Math.max(idx, 0), FOCUS.length - 1));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [FOCUS.length]);

  const scrollToIndex = (idx: number) => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const gap = 16;
    const w = first ? first.clientWidth + gap : el.clientWidth * 0.9;
    el.scrollTo({ left: idx * w, behavior: "smooth" });
  };

  const scrollByCards = (dir: -1 | 1) => {
    const next = (active + dir + FOCUS.length) % FOCUS.length;
    scrollToIndex(next);
  };

  // autoplay with pause on hover/focus/touch & reduced-motion support
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      scrollByCards(1);
    }, 4500);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [FOCUS.length]);

  const pause = () => (pausedRef.current = true);
  const resume = () => (pausedRef.current = false);

  return (
    <section className="py-14">
      <div className="container">
        <div className="text-center">
          <p className="text-emerald-700 text-sm font-semibold">What drives us</p>
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">Areas of Focus</h2>
          <div className="mt-2 h-1 w-16 bg-yellow-400 rounded mx-auto" />
        </div>

        {/* Slider */}
        <div className="relative mt-8">
          {/* Track */}
          <div
            ref={trackRef}
            className="
              flex gap-4 overflow-x-auto pb-2 no-scrollbar
              snap-x snap-mandatory
              scroll-pl-4 md:scroll-pl-0
            "
            style={{ scrollBehavior: "smooth" }}
            onMouseEnter={pause}
            onMouseLeave={resume}
            onFocusCapture={pause}
            onBlurCapture={resume}
            onTouchStart={pause}
            onTouchEnd={() => setTimeout(resume, 400)}
          >
            {FOCUS.map((f) => (
              <article
                key={f.title}
                className="
                  snap-start shrink-0
                  basis-[85%] sm:basis-[60%] md:basis-[45%] lg:basis-[32%]
                  rounded-2xl ring-1 ring-gray-200 bg-white shadow-sm overflow-hidden
                  transition hover:shadow-md
                "
              >
                <div className="relative">
                  <img src={f.image} alt={f.title} className="h-76 w-full object-cover" />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-emerald-900 ring-1 ring-yellow-300">
                    <CheckCircle2 className="w-3 h-3" /> Focus
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-emerald-900 text-lg">{f.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-gray-700">{f.text}</p>
                  {f.to ? (
                    <div className="mt-4">
                      <Link
                        to={f.to}
                        className="inline-flex items-center gap-2 text-emerald-900 hover:underline"
                      >
                        Read more <span aria-hidden>→</span>
                      </Link>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>

          {/* Arrows (brand-consistent) */}
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden md:flex items-center justify-between px-2">
            {/* <button
              aria-label="Previous"
              onClick={() => scrollByCards(-1)}
              className="pointer-events-auto rounded-full bg-emerald-900/90 text-white p-2 hover:bg-emerald-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              aria-label="Next"
              onClick={() => scrollByCards(1)}
              className="pointer-events-auto rounded-full bg-emerald-900/90 text-white p-2 hover:bg-emerald-900"
            >
              <ArrowRight className="w-5 h-5" />
            </button> */}
          </div>

          {/* Dots */}
          {/* <div className="mt-6 flex items-center justify-center gap-2">
            {FOCUS.map((_, d) => (
              <button
                key={d}
                aria-label={`Go to slide ${d + 1}`}
                onClick={() => scrollToIndex(d)}
                className={`h-2.5 rounded-full transition-all ${
                  d === active ? "w-6 bg-emerald-900" : "w-2.5 bg-gray-300"
                }`}
              />
            ))}
          </div> */}
        </div>
      </div>
    </section>
  );
}
