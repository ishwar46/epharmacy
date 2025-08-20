import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Percent,
  Truck,
  Clock,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getPromoBannerData } from "../services/promoBannerService";

const PromoBanner = () => {
  const navigate = useNavigate();

  // Dynamic state
  const [slides, setSlides] = useState([]);
  const [features, setFeatures] = useState([]);
  const [config, setConfig] = useState({
    autoplayMs: 5500,
    showArrows: true,
    showDots: true,
    enableTouch: true,
  });
  const [loading, setLoading] = useState(true);

  // Icon mapping for dynamic icons
  const iconMap = {
    Percent,
    Truck,
    Clock,
    Shield,
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPromoBannerData();
        if (response.success) {
          setSlides(response.data.slides || []);
          setFeatures(response.data.features || []);
          setConfig(response.data.config || config);
        }
      } catch (error) {
        console.error("Error fetching promo banner data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Transform slides for component usage
  const transformedSlides = slides.map((slide) => {
    const IconComponent = iconMap[slide.badgeIcon] || Percent;
    return {
      ...slide,
      badgeIcon: IconComponent,
      bg: `bg-gradient-to-r ${slide.bgGradient}`,
      primaryCta: {
        label: slide.primaryCta.label,
        onClick: () => navigate(slide.primaryCta.link),
      },
      secondaryCta: {
        label: slide.secondaryCta.label,
        onClick: () => navigate(slide.secondaryCta.link),
      },
    };
  });

  // Transform features for component usage
  const transformedFeatures = features.map((feature) => {
    const IconComponent = iconMap[feature.icon] || Truck;
    return {
      ...feature,
      icon: IconComponent,
      bgColor: `bg-gradient-to-r ${feature.bgColor}`,
      ctaAction: () => {
        if (feature.ctaAction.startsWith("tel:")) {
          window.open(feature.ctaAction);
        } else {
          navigate(feature.ctaAction);
        }
      },
    };
  });

  // Slider logic (no libs)
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);

  const goTo = (i) =>
    setIndex((i + transformedSlides.length) % transformedSlides.length);
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  useEffect(() => {
    if (isHovering || transformedSlides.length === 0) return;
    const id = setInterval(next, config.autoplayMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, isHovering, transformedSlides.length, config.autoplayMs]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };
  const onTouchMove = (e) => {
    if (touchStartX.current == null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };
  const onTouchEnd = () => {
    if (touchDeltaX.current > 50) prev();
    else if (touchDeltaX.current < -50) next();
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-200 animate-pulse rounded-lg sm:rounded-2xl h-[260px] sm:h-[320px]" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-200 animate-pulse rounded-lg sm:rounded-xl h-32"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no data, don't render
  if (transformedSlides.length === 0 && transformedFeatures.length === 0) {
    return null;
  }

  return (
    <section className="py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Slider */}
        {transformedSlides.length > 0 && (
          <div
            className="relative rounded-lg sm:rounded-2xl overflow-hidden select-none"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onTouchStart={config.enableTouch ? onTouchStart : undefined}
            onTouchMove={config.enableTouch ? onTouchMove : undefined}
            onTouchEnd={config.enableTouch ? onTouchEnd : undefined}
          >
            {/* Track */}
            <div
              className="whitespace-nowrap transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {transformedSlides.map((s) => (
                <div
                  key={s.id}
                  className={`${s.bg} text-white inline-block align-top w-full`}
                >
                  {/* mobile-first paddings/heights */}
                  <div className="relative overflow-hidden p-5 sm:p-8 lg:p-12 min-h-[260px] sm:min-h-[320px]">
                    {/* background shapes (lowest) */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
                      <div className="absolute top-0 left-0 w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-full -translate-x-20 -translate-y-20" />
                      <div className="absolute bottom-0 right-0 w-44 h-44 sm:w-60 sm:h-60 bg-white rounded-full translate-x-16 translate-y-10 sm:translate-x-24 sm:translate-y-16" />
                    </div>

                    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-12 items-center">
                      {/* Content (highest) */}
                      <div className="relative z-20 space-y-3 sm:space-y-5">
                        {/* Badge row */}
                        <div className="flex items-center gap-2">
                          <s.badgeIcon
                            size={18}
                            className="opacity-90 sm:w-5 sm:h-5"
                            aria-hidden="true"
                          />
                          <span
                            className={`${s.badgeClass} px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold`}
                          >
                            {s.badgeText}
                          </span>
                        </div>

                        {/* Heading + copy (mobile-first sizes) */}
                        <div className="max-w-[38ch] sm:max-w-[48ch]">
                          <h2 className="text-xl leading-tight font-bold sm:text-3xl lg:text-4xl mb-2 sm:mb-3">
                            {s.title}
                          </h2>
                          <p className="text-sm leading-relaxed text-white/85 sm:text-base lg:text-lg">
                            {s.description}
                          </p>
                        </div>

                        {/* CTAs – stack on mobile */}
                        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 pt-1">
                          <button
                            onClick={s.primaryCta.onClick}
                            className="inline-flex items-center justify-center gap-2 bg-white text-slate-800 px-4 py-2.5 rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-100 transition-colors"
                          >
                            <span>{s.primaryCta.label}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                          <button
                            onClick={s.secondaryCta.onClick}
                            className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-4 py-2.5 rounded-lg text-sm sm:text-base font-semibold hover:bg-white hover:text-slate-900 transition-colors"
                          >
                            <span>{s.secondaryCta.label}</span>
                          </button>
                        </div>
                      </div>

                      {/* Glass card only on large screens */}
                      <div className="hidden lg:block relative z-10 lg:justify-self-end lg:self-center">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center pointer-events-none lg:max-w-[340px]">
                          <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-6xl">{s.accentEmoji}</span>
                          </div>
                          <p className="text-white/80 font-medium">
                            {s.footNote}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Arrows – hide on XS, show from sm */}
            {config.showArrows && (
              <>
                <button
                  aria-label="Previous"
                  onClick={prev}
                  className="hidden sm:flex absolute top-1/2 -translate-y-1/2 left-3 lg:left-4 p-2 rounded-full bg-black/30 hover:bg-black/40 text-white backdrop-blur-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  aria-label="Next"
                  onClick={next}
                  className="hidden sm:flex absolute top-1/2 -translate-y-1/2 right-3 lg:right-4 p-2 rounded-full bg-black/30 hover:bg-black/40 text-white backdrop-blur-sm"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Dots */}
            {config.showDots && (
              <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex items-center justify-center gap-2">
                {transformedSlides.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => goTo(i)}
                    className={`h-2 rounded-full transition-all ${
                      index === i
                        ? "w-6 bg-white"
                        : "w-2 bg-white/60 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Features Grid */}
        {transformedFeatures.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
            {transformedFeatures.map((promo) => (
              <div
                key={promo.id}
                className={`${promo.bgColor} rounded-lg sm:rounded-xl text-white p-4 sm:p-6 cursor-pointer transform hover:scale-[1.02] transition-transform duration-200`}
                onClick={promo.ctaAction}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <promo.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base">
                      {promo.title}
                    </h3>
                    <p className="text-xs sm:text-sm opacity-90">
                      {promo.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm opacity-90 mb-3 leading-relaxed">
                  {promo.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-medium">
                    {promo.ctaText}
                  </span>
                  <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 opacity-75" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PromoBanner;
