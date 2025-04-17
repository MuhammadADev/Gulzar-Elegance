import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { X, ShoppingBag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";

const Wishlist = () => {
  const { wishlistItems, removeItem, isLoading, isLoggedIn } = useWishlist();
  const { addItem } = useCart();
  
  const handleAddToCart = async (productId: number) => {
    await addItem(productId, 1);
  };
  
  const handleRemoveFromWishlist = async (productId: number) => {
    await removeItem(productId);
  };
  
  if (!isLoggedIn) {
    return (
      <>
        <Helmet>
          <title>Wishlist | Gulzar</title>
        </Helmet>
        
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-3xl font-display font-semibold mb-8 text-center">My Wishlist</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <Heart className="h-16 w-16 text-neutral-dark opacity-30" />
            </div>
            <h2 className="text-2xl font-medium mb-2">Please sign in</h2>
            <p className="text-neutral-dark mb-8">
              You need to be logged in to view and manage your wishlist.
            </p>
            <Button size="lg" asChild>
              <Link href="/login?redirect=/wishlist">Sign In</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-3xl font-display font-semibold mb-8 text-center">My Wishlist</h1>
        <div className="text-center">
          <div className="animate-pulse inline-block h-16 w-16 rounded-full bg-primary-light"></div>
          <div className="h-6 w-48 bg-muted rounded animate-pulse mx-auto mt-4"></div>
        </div>
      </div>
    );
  }
  
  if (wishlistItems.length === 0) {
    return (
      <>
        <Helmet>
          <title>Wishlist | Gulzar</title>
        </Helmet>
        
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-3xl font-display font-semibold mb-8 text-center">My Wishlist</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <Heart className="h-16 w-16 text-neutral-dark opacity-30" />
            </div>
            <h2 className="text-2xl font-medium mb-2">Your wishlist is empty</h2>
            <p className="text-neutral-dark mb-8">
              Save your favorite items to your wishlist for easy access later.
            </p>
            <Button size="lg" asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Wishlist ({wishlistItems.length}) | Gulzar</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-display font-semibold mb-8">My Wishlist</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => {
            const product = item.product;
            if (!product) return null;
            
            return (
              <Card key={item.id} className="overflow-hidden group">
                <div className="relative">
                  <Link href={`/product/${product.id}`}>
                    <div className="aspect-[3/4] overflow-hidden">
                      <img 
                        src={product.thumbnailImage} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </Link>
                  
                  <button 
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-neutral-light transition-colors"
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    disabled={isLoading}
                    aria-label="Remove from wishlist"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  
                  {product.newArrival && (
                    <Badge 
                      variant="secondary" 
                      className="absolute top-2 left-2"
                    >
                      New
                    </Badge>
                  )}
                  
                  {product.salePrice && (
                    <Badge 
                      variant="destructive" 
                      className="absolute top-2 left-2"
                    >
                      Sale
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-medium mb-1 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      {product.salePrice ? (
                        <div>
                          <span className="text-gray-500 line-through text-sm mr-2">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-primary font-semibold">
                            {formatPrice(product.salePrice)}
                          </span>
                        </div>
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
                            fill={i < Math.floor(product.averageRating) ? "currentColor" : "none"}
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
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => handleAddToCart(product.id)}
                    disabled={isLoading || !product.inStock}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Wishlist;
