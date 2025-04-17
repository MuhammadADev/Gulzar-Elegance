import { useState } from "react";
import { Link } from "wouter";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: any;
  className?: string;
  badgeText?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline" | "accent";
  onQuickView?: (product: any) => void;
}

const ProductCard = ({ 
  product, 
  className, 
  badgeText, 
  badgeVariant = "secondary",
  onQuickView
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  
  // Use contexts with built-in fallbacks
  const { addItem, isLoading: isCartLoading } = useCart(); 
  const { addItem: addToWishlist, isInWishlist, isLoggedIn } = useWishlist();
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive"
      });
      return;
    }
    await addItem(product.id, 1);
  };
  
  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your wishlist.",
        variant: "destructive"
      });
      return;
    }
    
    await addToWishlist(product.id);
  };
  
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };
  
  // Badge text logic
  const badge = badgeText || (product.newArrival ? "New" : null);

  return (
    <div 
      className={cn("product-card group relative", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg">
        {badge && (
          <Badge 
            variant={badgeVariant} 
            className="absolute top-2 left-2 z-10"
          >
            {badge}
          </Badge>
        )}
        
        <Link href={`/product/${product.id}`} className="block">
          <div className="aspect-[3/4] overflow-hidden bg-gray-100">
            {product?.thumbnailImage ? (
              <img 
                src={product.thumbnailImage} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  // If image fails to load, replace with a fallback
                  e.currentTarget.src = 'https://placehold.co/300x400/e2e8f0/475569?text=Image+Not+Found';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                <span className="text-xs">Image not available</span>
              </div>
            )}
          </div>
          
          {isHovered && (
            <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center">
              <Button
                onClick={handleQuickView}
                variant="default"
                className="quick-view rounded-full bg-white text-primary hover:bg-primary hover:text-white transition-all py-2 px-4 text-sm font-medium shadow-md"
              >
                <Eye className="h-4 w-4 mr-2" /> Quick View
              </Button>
            </div>
          )}
          
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <Button
              onClick={handleAddToWishlist}
              variant="ghost"
              size="icon"
              className="bg-white p-2 rounded-full text-neutral-dark hover:text-secondary transition-colors"
            >
              <Heart className={cn("h-4 w-4", isInWishlist(product.id) ? "fill-secondary text-secondary" : "")} />
            </Button>
            
            <Button
              onClick={handleAddToCart}
              variant="ghost"
              size="icon"
              disabled={isCartLoading || !product.inStock}
              className="bg-white p-2 rounded-full text-neutral-dark hover:text-primary transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
          </div>
        </Link>
      </div>
      
      <div className="pt-4">
        <Link href={`/product/${product.id}`} className="block">
          <h3 className="font-medium text-neutral-dark truncate">{product.name}</h3>
          <div className="flex justify-between items-center mt-1">
            <div>
              {product.salePrice ? (
                <>
                  <span className="text-gray-500 line-through text-sm mr-2">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-primary font-semibold">
                    {formatPrice(product.salePrice)}
                  </span>
                </>
              ) : (
                <span className="text-primary font-semibold">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <div className="flex items-center">
              <div className="flex text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={i < Math.floor(product.averageRating || 0) ? "currentColor" : "none"}
                    stroke="currentColor"
                    className="h-3 w-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                ))}
                <span className="text-xs text-neutral-dark ml-1">({product.reviewCount || 0})</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
