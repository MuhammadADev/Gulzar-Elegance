import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroSlides } from "@/lib/constants";

const HeroSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(heroSlides.map(() => false));

  const nextSlide = useCallback(() => {
    setActiveIndex((current) => (current === heroSlides.length - 1 ? 0 : current + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((current) => (current === 0 ? heroSlides.length - 1 : current - 1));
  }, []);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handleImageLoad = useCallback((index: number) => {
    setImagesLoaded(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  }, []);

  // Auto-advance slides unless paused
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  // Preload all images
  useEffect(() => {
    heroSlides.forEach((slide, index) => {
      const img = new Image();
      img.src = slide.image;
      img.onload = () => handleImageLoad(index);
    });
  }, [handleImageLoad]);

  return (
    <section className="relative">
      <div className="relative h-[60vh] overflow-hidden">
        {/* Slider images */}
        <div className="absolute inset-0 w-full h-full">
          {heroSlides.map((slide, index) => (
            <div 
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                index === activeIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20 z-10"></div>
              {imagesLoaded[index] ? (
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 animate-pulse"></div>
              )}
              <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 z-20">
                <div className="text-center text-white max-w-lg">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">{slide.title}</h2>
                  <p className="text-lg mb-6">{slide.description}</p>
                  <Button 
                    variant="default" 
                    className="bg-white text-primary hover:bg-primary hover:text-white transition-colors px-8 py-3 rounded-full"
                    asChild
                  >
                    <Link href={slide.buttonLink}>{slide.buttonText}</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Slider controls */}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center space-x-2 z-30">
          {heroSlides.map((_, index) => (
            <button 
              key={index}
              className={`w-3 h-3 rounded-full bg-white ${
                index === activeIndex ? 'bg-opacity-100' : 'bg-opacity-50'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
        
        {/* Prev/Next buttons */}
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-70 rounded-full w-10 h-10 flex items-center justify-center text-primary transition-all z-30"
          onClick={prevSlide}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-70 rounded-full w-10 h-10 flex items-center justify-center text-primary transition-all z-30"
          onClick={nextSlide}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
};

export default HeroSlider;
