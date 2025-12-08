import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import heroBlackFriday from "../assets/hero-black-friday.jpg";
import heroNewArrivals from "../assets/hero-new-arrivals.jpg";
import heroElectronics from "../assets/hero-black-friday.jpg";
import Gabbs from "../assets/gabbs-carousel.png";

const slides = [
  {
    id: 1,
    title: "Black Friday Deals",
    subtitle: "Up to 70% Off on Selected Items",
    cta: "Shop Now",
    link: "/products",
    image: heroBlackFriday,
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Discover the Latest Products",
    cta: "Explore",
    link: "/categories",
    image: heroNewArrivals,
  },
  {
    id: 3,
    title: "Premium Electronics",
    subtitle: "Get the Best Tech at Amazing Prices",
    cta: "Browse Electronics",
    link: "/products",
    image: heroElectronics,
  },
  {
    id: 4,
    title: "Gabbs",
    subtitle: "Online Shopping for you and your family",
    cta: "Browse Everything",
    link: "/products",
    image: Gabbs,
  },
];

const HeroCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();

    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  return (
    <div className="relative w-full">
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div key={slide.id} className="flex-[0_0_100%] min-w-0">
              <div
                className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] bg-cover bg-center flex items-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Content */}
                <div className="container mx-auto px-6 md:px-16 lg:px-24 z-10">
                  <div className="max-w-lg md:max-w-xl lg:max-w-2xl animate-fade-in text-white text-center md:text-left">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight drop-shadow-lg">
                      {slide.title}
                    </h2>
                    <p className="text-lg sm:text-xl md:text-2xl mb-6 opacity-95 drop-shadow-md">
                      {slide.subtitle}
                    </p>
                    <Link to={slide.link}>
                      <button className="bg-primary text-primary-foreground px-6 py-3 sm:px-8 sm:py-4 rounded-lg hover:brightness-90 transition text-base sm:text-lg md:text-xl">
                        {slide.cta}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next Buttons */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white border border-white/20 flex items-center justify-center shadow-lg transition-colors z-10"
      >
        <ChevronLeft className="h-6 w-6 text-black" />
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white border border-white/20 flex items-center justify-center shadow-lg transition-colors z-10"
      >
        <ChevronRight className="h-6 w-6 text-black" />
      </button>

      {/* Pagination */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === selectedIndex
                ? "bg-white w-8 sm:w-6"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
