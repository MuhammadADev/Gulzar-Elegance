import { useState } from "react";
import { Link } from "wouter";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Heart, Share2 } from "lucide-react";
import { availableSizes, availableColors } from "@/lib/constants";

interface QuickViewModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal = ({ product, isOpen, onClose }: QuickViewModalProps) => {
  const [selectedImage, setSelectedImage] = useState(product.thumbnailImage);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  const { addItem, isLoading: isCartLoading } = useCart();
  const { addItem: addToWishlist, isInWishlist, isLoggedIn } = useWishlist();
  
  // Get product images array, or use thumbnail as fallback
  const productImages = product.images || [{ imageUrl: product.thumbnailImage }];
  
  const handleAddToCart = async () => {
    // Get variant ID if both size and color are selected
    let variantId = null;
    if (selectedSize && selectedColor && product.variants) {
      const variant = product.variants.find(
        (v: any) => v.size === selectedSize && v.color === selectedColor
      );
      if (variant) variantId = variant.id;
    }
    
    await addItem(product.id, quantity, variantId);
    onClose();
  };
  
  const handleAddToWishlist = async () => {
    if (!isLoggedIn) {
      onClose();
      return;
    }
    
    await addToWishlist(product.id);
  };
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    } else if (e.target.value === "") {
      setQuantity(1);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 gap-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product images */}
          <div className="p-6">
            <div className="relative aspect-square mb-2 overflow-hidden rounded-lg">
              <img 
                src={selectedImage} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image: any, index: number) => (
                <button 
                  key={index}
                  className={`border-2 rounded-md overflow-hidden ${
                    (image.imageUrl || image.isPrimary) === selectedImage ? 'border-primary' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImage(image.imageUrl || product.thumbnailImage)}
                >
                  <img 
                    src={image.imageUrl || product.thumbnailImage} 
                    alt={`${product.name} - view ${index + 1}`}
                    className="w-full aspect-square object-cover" 
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product info */}
          <div className="p-6">
            <DialogTitle className="text-2xl font-medium text-neutral-dark mb-2">
              {product.name}
            </DialogTitle>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={i < Math.floor(product.averageRating) ? "currentColor" : "none"}
                    stroke="currentColor"
                    className="h-4 w-4 text-accent"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                ))}
                <span className="text-xs text-neutral-dark ml-1">({product.reviewCount} reviews)</span>
              </div>
              <span className="text-sm text-primary">{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
            </div>
            
            <div className="mb-4">
              {product.salePrice ? (
                <div>
                  <span className="text-gray-500 line-through text-sm mr-2">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-primary text-2xl font-semibold">
                    {formatPrice(product.salePrice)}
                  </span>
                </div>
              ) : (
                <span className="text-primary text-2xl font-semibold">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            
            <DialogDescription className="mb-4 text-neutral-dark">
              {product.description}
            </DialogDescription>
            
            {availableColors.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Color</h3>
                <div className="flex space-x-2">
                  {availableColors.map((color) => (
                    <button 
                      key={color.name}
                      className={`w-8 h-8 rounded-full focus:outline-none ${
                        selectedColor === color.name 
                          ? 'ring-2 ring-primary ring-offset-2' 
                          : 'border-2 border-white'
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setSelectedColor(color.name)}
                      aria-label={`Select ${color.name} color`}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {availableSizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button 
                      key={size}
                      className={`px-3 py-1 border rounded-md text-sm hover:border-primary focus:outline-none ${
                        selectedSize === size
                          ? 'bg-primary text-white'
                          : 'border-gray-300'
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <Link href="/size-guide" className="text-primary text-sm mt-2 inline-block">
                  Size Guide
                </Link>
              </div>
            )}
            
            <div className="flex items-center mb-6">
              <div className="flex items-center border border-gray-300 rounded-md mr-4">
                <button 
                  className="px-3 py-2 text-neutral-dark hover:text-primary"
                  onClick={decrementQuantity}
                >
                  -
                </button>
                <Input 
                  type="text" 
                  value={quantity} 
                  onChange={handleQuantityChange}
                  className="w-12 text-center border-none focus:outline-none"
                  aria-label="Quantity"
                />
                <button 
                  className="px-3 py-2 text-neutral-dark hover:text-primary"
                  onClick={incrementQuantity}
                >
                  +
                </button>
              </div>
              
              <Button 
                onClick={handleAddToCart} 
                className="bg-primary hover:bg-primary-dark text-white transition-colors px-6 py-3 rounded-md font-medium flex-grow"
                disabled={isCartLoading || !product.inStock}
              >
                {isCartLoading ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
            
            <div className="flex space-x-4 mb-6">
              <Button 
                variant="ghost"
                className="text-neutral-dark hover:text-secondary transition-colors flex items-center"
                onClick={handleAddToWishlist}
              >
                <Heart className={`mr-2 h-4 w-4 ${isInWishlist(product.id) ? "fill-secondary text-secondary" : ""}`} /> 
                Add to Wishlist
              </Button>
              <Button 
                variant="ghost"
                className="text-neutral-dark hover:text-primary transition-colors flex items-center"
                onClick={() => {
                  navigator.share?.({
                    title: product.name,
                    text: product.description,
                    url: window.location.href,
                  }).catch(() => {
                    // Fallback if Web Share API is not available
                    navigator.clipboard.writeText(window.location.href);
                  });
                }}
              >
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center text-sm">
                <span className="mr-4">SKU: {product.sku}</span>
                <span>Category: {product.category.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
