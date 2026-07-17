import { useCallback, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

import type { CarouselSlide } from "@/domain/home/CarouselSlide";
import { cn } from "@/shared/lib/cn";
import i18n from "@/shared/i18n";

type PanoramaCarouselProps = {
  slides: CarouselSlide[];
};

/** Full-bleed panorama hero carousel with side navigation buttons. */
export function PanoramaCarousel({ slides }: PanoramaCarouselProps) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const slideCount = slides.length;
  const activeSlide = slides[activeIndex];

  const goTo = useCallback(
    (index: number) => {
      if (slideCount === 0) return;
      const next = ((index % slideCount) + slideCount) % slideCount;
      setActiveIndex(next);
    },
    [slideCount],
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  // Keyboard support when the carousel is focused
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev]);

  if (!activeSlide) return null;

  return (
    <section
      className="panorama-carousel"
      aria-roledescription="carousel"
      aria-label={t("home.carousel.label")}
    >
      <div className="panorama-carousel-track">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "panorama-carousel-slide",
              index === activeIndex && "panorama-carousel-slide--active",
            )}
            aria-hidden={index !== activeIndex}
          >
            <img
              src={slide.imageUrl}
              alt=""
              className="panorama-carousel-image"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}

        {/* Soft gradient so title stays readable */}
        <div className="panorama-carousel-overlay" aria-hidden />
      </div>

      {/* Slide copy */}
      <div
        className={cn(
          "panorama-carousel-content mx-20",
          i18n.language === "ar" && ": text-left",
        )}
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
      >
        <p className="panorama-carousel-eyebrow">{t("app.name")}</p>
        <h1 className="panorama-carousel-title">{t(activeSlide.titleKey)}</h1>
        <p className="panorama-carousel-subtitle">
          {t(activeSlide.subtitleKey)}
        </p>
      </div>

      {/* Side navigation */}
      <button
        type="button"
        className="panorama-carousel-nav panorama-carousel-nav--prev"
        onClick={goPrev}
        aria-label={t("home.carousel.prev")}
      >
        <FaChevronLeft aria-hidden />
      </button>
      <button
        type="button"
        className="panorama-carousel-nav panorama-carousel-nav--next"
        onClick={goNext}
        aria-label={t("home.carousel.next")}
      >
        <FaChevronRight aria-hidden />
      </button>

      {/* Slide indicators */}
      <div className="panorama-carousel-dots" role="tablist">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={t("home.carousel.goToSlide", { number: index + 1 })}
            className={cn(
              "panorama-carousel-dot",
              index === activeIndex && "panorama-carousel-dot--active",
            )}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </section>
  );
}
