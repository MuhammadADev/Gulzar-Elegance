import { useState, useEffect } from "react";
import { Link } from "wouter";
import { categories } from "@/lib/constants";

const CategoryGrid = () => {
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  // Preload all category images
  useEffect(() => {
    categories.forEach(category => {
      const img = new Image();
      img.src = category.image;
      img.onload = () => {
        setLoadedImages(prev => ({
          ...prev,
          [category.id]: true
        }));
      };
    });
  }, []);

  return (
    <section className="py-12 px-4 container mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-semibold font-display mb-1">Shop by Category</h2>
        <div className="w-24 h-1 bg-accent mx-auto"></div>
        <p className="mt-4 text-neutral-dark">Explore our curated collections for every occasion</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {categories.map((category) => (
          <Link 
            key={category.id} 
            href={`/products/${category.slug}`} 
            className="category-card relative rounded-lg overflow-hidden shadow-md h-64 group"
          >
            {loadedImages[category.id] ? (
              <img 
                src={category.image} 
                alt={category.name} 
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 animate-pulse"></div>
            )}
            <div className="absolute bottom-0 left-0 w-full p-4 z-10">
              <h3 className="text-white text-xl font-medium font-display">{category.name}</h3>
              <p className="text-white text-sm opacity-90">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
