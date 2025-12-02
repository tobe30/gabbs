import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

// Replace these with actual paths to your images
import heroBlackFriday from "../assets/hero-black-friday.jpg";
import heroNewArrivals from "../assets/hero-new-arrivals.jpg";
import heroElectronics from "../assets/hero-black-friday.jpg";
import Gabbs from "../assets/gabbs-carousel.png"


// Reusable button component (Tailwind version)


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
    subtitle: "OnlineShopping for you and your family",
    cta: "Browse everything",
    link: "/products",
    image: Gabbs,
  },
];


const HeroCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
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

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div key={slide.id} className="flex-[0_0_100%] min-w-0">
              <div
                className="relative h-[400px] md:h-[500px] bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-black/40" />
                          <div
            className="container mx-auto px-4 pl-20 md:pl-32 h-full flex items-center relative z-10"
          >
            <div className="max-w-2xl animate-fade-in text-white">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-lg">
                {slide.title}
              </h2>
              <p className="text-xl md:text-2xl mb-8 opacity-95 drop-shadow-md">
                {slide.subtitle}
              </p>
           <Link to={slide.link}>
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:brightness-90 transition text-lg">
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

     <button
  onClick={scrollPrev}
  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white hover:bg-white/90 border border-white/20 flex items-center justify-center shadow-lg transition-colors z-10"
>
  <ChevronLeft className="h-6 w-6 text-black" />
</button>


      <button
  onClick={scrollNext}
  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white hover:bg-white/90 border border-white/20 flex items-center justify-center shadow-lg transition-colors z-10"
>
  <ChevronRight className="h-6 w-6 text-black" />
</button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === selectedIndex
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
