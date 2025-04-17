import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Trash, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";

const Cart = () => {
  const { cartItems, totalItems, totalPrice, updateItemQuantity, removeItem, clearCart, isLoading } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode) return;
    
    setIsApplyingPromo(true);
    // Mock promo code application
    setTimeout(() => {
      setIsApplyingPromo(false);
      setPromoCode("");
    }, 1000);
  };
  
  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItemQuantity(itemId, newQuantity);
  };
  
  // Calculate shipping cost (free over ₨5,000)
  const shippingCost = totalPrice >= 5000 ? 0 : 250;
  
  // Calculate totals
  const subtotal = totalPrice;
  const total = subtotal + shippingCost;
  
  if (cartItems.length === 0) {
    return (
      <>
        <Helmet>
          <title>Your Cart | Gulzar</title>
        </Helmet>
        
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-3xl font-display font-semibold mb-8 text-center">Your Shopping Cart</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <ShoppingBag className="h-16 w-16 text-neutral-dark opacity-30" />
            </div>
            <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-neutral-dark mb-8">
              Looks like you haven't added any items to your cart yet.
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
        <title>Your Cart ({totalItems}) | Gulzar</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-display font-semibold mb-8">Your Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium">Items ({totalItems})</h2>
                  <Button 
                    variant="ghost" 
                    className="text-sm text-muted-foreground"
                    onClick={() => clearCart()}
                    disabled={isLoading}
                  >
                    <Trash className="h-4 w-4 mr-2" /> Clear Cart
                  </Button>
                </div>
                
                <Separator className="mb-6" />
                
                {/* Cart Items List */}
                <div className="space-y-6">
                  {cartItems.map((item) => {
                    const product = item.product;
                    if (!product) return null;
                    
                    return (
                      <div key={item.id} className="flex items-start">
                        <Link href={`/product/${product.id}`} className="block w-20 h-24 bg-neutral-light rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={product.thumbnailImage}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                        
                        <div className="ml-4 flex-grow">
                          <div className="flex justify-between">
                            <Link href={`/product/${product.id}`} className="font-medium hover:text-primary">
                              {product.name}
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-destructive"
                              onClick={() => removeItem(item.id)}
                              disabled={isLoading}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="text-sm text-muted-foreground mt-1">
                            {item.variant?.size && <span className="mr-4">Size: {item.variant.size}</span>}
                            {item.variant?.color && <span>Color: {item.variant.color}</span>}
                          </div>
                          
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center border border-gray-200 rounded">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={isLoading || item.quantity <= 1}
                              >
                                <span className="text-sm">-</span>
                              </Button>
                              <Input
                                type="text"
                                value={item.quantity}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (!isNaN(val) && val > 0) {
                                    updateQuantity(item.id, val);
                                  }
                                }}
                                className="w-12 text-center border-none h-8 p-0 text-sm"
                                disabled={isLoading}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={isLoading}
                              >
                                <span className="text-sm">+</span>
                              </Button>
                            </div>
                            <div>
                              <span className="font-medium">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                              {item.quantity > 1 && (
                                <span className="text-xs text-muted-foreground block">
                                  {formatPrice(item.price)} each
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Button variant="outline" asChild className="flex items-center">
                <Link href="/products">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-medium mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      <span>{formatPrice(shippingCost)}</span>
                    )}
                  </div>
                  
                  <form onSubmit={handleApplyPromo} className="pt-3 pb-3">
                    <div className="flex space-x-2">
                      <Input
                        type="text"
                        placeholder="Promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-grow"
                      />
                      <Button type="submit" disabled={!promoCode || isApplyingPromo}>
                        {isApplyingPromo ? "Applying..." : "Apply"}
                      </Button>
                    </div>
                  </form>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-medium text-lg pt-2">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  
                  <div className="text-xs text-center text-muted-foreground">
                    Taxes calculated at checkout
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button className="w-full" size="lg" asChild>
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                
                {shippingCost > 0 && (
                  <p className="text-xs text-center text-muted-foreground">
                    Add {formatPrice(5000 - subtotal)} more to qualify for free shipping
                  </p>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
