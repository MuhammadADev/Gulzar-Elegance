import { useState, useEffect } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { instagramPosts } from "@/lib/constants";

const InstagramFeed = () => {
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  // Preload all Instagram images
  useEffect(() => {
    instagramPosts.forEach(post => {
      const img = new Image();
      img.src = post.image;
      img.onload = () => {
        setLoadedImages(prev => ({
          ...prev,
          [post.id]: true
        }));
      };
    });
  }, []);

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold font-display mb-1">Follow Us On Instagram</h2>
          <div className="w-24 h-1 bg-accent mx-auto"></div>
          <p className="mt-4 text-neutral-dark">@gulzarfashion</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {instagramPosts.map((post) => (
            <a 
              key={post.id} 
              href={post.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group relative overflow-hidden"
            >
              <div className="aspect-square overflow-hidden">
                {loadedImages[post.id] ? (
                  <img 
                    src={post.image} 
                    alt="Instagram post" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                )}
              </div>
              <div className="absolute inset-0 bg-primary bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-3 text-white">
                  <span className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" /> {post.likes}
                  </span>
                  <span className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1" /> {post.comments}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
