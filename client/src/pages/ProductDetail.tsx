import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useParams, Link } from "wouter";
import { 
  Heart, 
  Share2, 
  ShoppingBag,
  Truck, 
  RotateCcw, 
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import { availableSizes, availableColors } from "@/lib/constants";
import ProductCard from "@/components/products/ProductCard";

const ProductDetail = () => {
  const { id } = useParams();
  const productId = parseInt(id);
  const { addItem, isLoading: isCartLoading } = useCart();
  const { addItem: addToWishlist, isInWishlist, isLoggedIn } = useWishlist();
  const { toast } = useToast();
  
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  // Fetch product details
  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: [`/api/products/${productId}`],
    enabled: !isNaN(productId)
  });
  
  // Fetch related products based on category
  const { data: relatedProducts, isLoading: isRelatedLoading } = useQuery({
    queryKey: [`/api/products?category=${product?.category}&limit=4`],
    enabled: !!product?.category
  });
  
  // Set selected image when product loads
  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      // Find primary image or use the first one
      const primaryImage = product.images.find(img => img.isPrimary);
      setSelectedImage(primaryImage ? primaryImage.imageUrl : product.images[0].imageUrl);
    } else if (product) {
      setSelectedImage(product.thumbnailImage);
    }
  }, [product]);
  
  // Filter related products to exclude current product
  const filteredRelatedProducts = relatedProducts?.filter(p => p.id !== productId) || [];
  
  const handleAddToCart = async () => {
    if (!product) return;
    
    // Get variant ID if both size and color are selected
    let variantId = null;
    if (selectedSize && selectedColor && product.variants) {
      const variant = product.variants.find(
        v => v.size === selectedSize && v.color === selectedColor
      );
      if (variant) variantId = variant.id;
    }
    
    await addItem(product.id, quantity, variantId);
  };
  
  const handleAddToWishlist = async () => {
    if (!product) return;
    
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
  
  if (isProductLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Skeleton className="w-full aspect-square rounded-lg" />
            <div className="grid grid-cols-4 gap-2 mt-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="w-full aspect-square rounded-md" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }
  
  // Prepare images array - either from product.images or create from thumbnailImage
  const productImages = product.images?.length 
    ? product.images
    : [{ id: 0, productId: product.id, imageUrl: product.thumbnailImage, isPrimary: true }];
    
  return (
    <>
      <Helmet>
        <title>{product.name} | Gulzar</title>
        <meta name="description" content={product.description} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center text-sm text-neutral-dark">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/products" className="hover:text-primary">Products</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href={`/products/${product.category}`} className="hover:text-primary">
            {product.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="truncate">{product.name}</span>
        </div>
        
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Product Images */}
          <div>
            <div className="aspect-square overflow-hidden rounded-lg mb-4">
              <img 
                src={selectedImage || product.thumbnailImage} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button 
                  key={index}
                  className={`border-2 rounded-md overflow-hidden ${
                    image.imageUrl === selectedImage ? 'border-primary' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImage(image.imageUrl)}
                >
                  <img 
                    src={image.imageUrl} 
                    alt={`${product.name} - view ${index + 1}`}
                    className="w-full aspect-square object-cover" 
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div>
            <div className="mb-2 flex items-center space-x-2">
              {product.newArrival && <Badge variant="secondary">New Arrival</Badge>}
              {product.bestSeller && <Badge variant="accent">Bestseller</Badge>}
              {product.salePrice && <Badge variant="destructive">Sale</Badge>}
            </div>
            
            <h1 className="text-3xl font-bold mb-2 font-display">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-4">
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
                <span className="text-sm text-neutral-dark ml-1">
                  ({product.reviewCount} reviews)
                </span>
              </div>
              <span className="text-sm px-2 py-1 rounded bg-primary-light text-primary">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            
            <div className="mb-4">
              {product.salePrice ? (
                <div>
                  <span className="text-gray-500 line-through text-lg mr-2">
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
            
            <p className="text-neutral-dark mb-6">{product.description}</p>
            
            <Separator className="my-6" />
            
            {product.variants?.some(v => v.color) && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Color</h3>
                <div className="flex space-x-2">
                  {availableColors.map((color) => (
                    <button 
                      key={color.name}
                      className={`w-8 h-8 rounded-full focus:outline-none ${
                        selectedColor === color.name 
                          ? 'ring-2 ring-primary ring-offset-2' 
                          : 'border-2 border-white hover:scale-110 transition-transform'
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setSelectedColor(color.name)}
                      aria-label={`Select ${color.name} color`}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {product.variants?.some(v => v.size) && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Size</h3>
                  <Link href="/size-guide" className="text-primary text-sm">
                    Size Guide
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => {
                    const sizeVariant = product.variants?.find(v => v.size === size);
                    const isAvailable = sizeVariant?.inStock !== false;
                    
                    return (
                      <button 
                        key={size}
                        className={`px-4 py-2 border rounded-md text-sm hover:border-primary focus:outline-none transition-colors ${
                          selectedSize === size
                            ? 'bg-primary text-white border-primary'
                            : isAvailable
                              ? 'border-gray-300'
                              : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                        onClick={() => isAvailable && setSelectedSize(size)}
                        disabled={!isAvailable}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button 
                  className="px-3 py-2 text-neutral-dark hover:text-primary"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
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
                className="flex-1 rounded-full bg-primary hover:bg-primary-dark text-white transition-colors"
                disabled={isCartLoading || !product.inStock}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                {isCartLoading ? "Adding..." : "Add to Cart"}
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                className="rounded-full"
                onClick={handleAddToWishlist}
              >
                <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-secondary text-secondary" : ""}`} />
              </Button>
            </div>
            
            <div className="flex space-x-4 mb-8">
              <Button 
                variant="ghost"
                className="text-neutral-dark hover:text-primary transition-colors"
                onClick={() => {
                  navigator.share?.({
                    title: product.name,
                    text: product.description,
                    url: window.location.href,
                  }).catch(() => {
                    // Fallback if Web Share API is not available
                    navigator.clipboard.writeText(window.location.href);
                    toast({
                      title: "Link Copied",
                      description: "Product link copied to clipboard"
                    });
                  });
                }}
              >
                <Share2 className="h-4 w-4 mr-2" /> Share Product
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-2">
                  <Truck className="text-primary h-5 w-5" />
                </div>
                <p className="text-xs">Free Shipping</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-2">
                  <RotateCcw className="text-primary h-5 w-5" />
                </div>
                <p className="text-xs">Easy Returns</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck className="text-primary h-5 w-5" />
                </div>
                <p className="text-xs">Secure Checkout</p>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="text-sm text-neutral-dark">
              <p><span className="font-medium">SKU:</span> {product.sku}</p>
              <p><span className="font-medium">Category:</span> {product.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
              {product.collection && (
                <p><span className="font-medium">Collection:</span> {product.collection.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Product Tabs - Description, Details, Reviews */}
        <div className="mb-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start mb-6 bg-background">
              <TabsTrigger value="description" className="text-md">Description</TabsTrigger>
              <TabsTrigger value="details" className="text-md">Details</TabsTrigger>
              <TabsTrigger value="reviews" className="text-md">Reviews ({product.reviewCount})</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-2">
              <div className="prose max-w-none">
                <p>{product.description}</p>
                <p>
                  Gulzar brings you authentic Pakistani 3-piece suits with the finest 
                  fabrics and exquisite craftsmanship, celebrating cultural heritage 
                  with modern elegance. This beautiful ensemble consists of:
                </p>
                <ul>
                  <li>Intricately designed shirt/kameez</li>
                  <li>Contrasting/matching bottoms/pants</li>
                  <li>Complementary dupatta to complete the look</li>
                </ul>
                <p>
                  Perfect for casual wear, formal events, or festive celebrations. Each piece 
                  is carefully crafted to provide both comfort and style.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="details" className="pt-2">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium mb-4">Product Specifications</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 py-2 border-b">
                      <span className="text-neutral-dark">Fabric</span>
                      <span>Premium {product.category.includes('lawn') ? 'Lawn' : product.category.includes('cotton') ? 'Cotton' : product.category.includes('chiffon') ? 'Chiffon' : 'Mixed'}</span>
                    </div>
                    <div className="grid grid-cols-2 py-2 border-b">
                      <span className="text-neutral-dark">Type</span>
                      <span>3-Piece Suit</span>
                    </div>
                    <div className="grid grid-cols-2 py-2 border-b">
                      <span className="text-neutral-dark">Includes</span>
                      <span>Shirt, Trouser, Dupatta</span>
                    </div>
                    <div className="grid grid-cols-2 py-2 border-b">
                      <span className="text-neutral-dark">Embroidery</span>
                      <span>{product.category.includes('embroidered') ? 'Yes' : 'Minimal'}</span>
                    </div>
                    <div className="grid grid-cols-2 py-2 border-b">
                      <span className="text-neutral-dark">Style</span>
                      <span>{product.collection || 'Casual'}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-4">Care Instructions</h3>
                  <ul className="space-y-2 text-neutral-dark">
                    <li>• Dry clean recommended for first wash</li>
                    <li>• Machine wash with cold water for subsequent washes</li>
                    <li>• Wash dark colors separately</li>
                    <li>• Do not bleach</li>
                    <li>• Iron on medium heat</li>
                    <li>• Dry in shade</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="pt-2">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Customer Reviews</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex">
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
                      </div>
                      <span className="ml-2">Based on {product.reviewCount} reviews</span>
                    </div>
                  </div>
                  <Button asChild>
                    <Link href={`/login?redirect=/product/${product.id}#write-review`}>
                      Write a Review
                    </Link>
                  </Button>
                </div>
                
                <div className="bg-neutral-cream p-6 rounded-lg text-center">
                  <p className="mb-4">Login to see and write reviews for this product.</p>
                  <Button asChild>
                    <Link href={`/login?redirect=/product/${product.id}`}>
                      Login to Continue
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related Products */}
        {!isRelatedLoading && filteredRelatedProducts.length > 0 && (
          <div className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-display font-semibold">You May Also Like</h2>
              <Link href={`/products/${product.category}`} className="text-primary hover:text-primary-dark flex items-center">
                View More <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredRelatedProducts.slice(0, 4).map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetail;
