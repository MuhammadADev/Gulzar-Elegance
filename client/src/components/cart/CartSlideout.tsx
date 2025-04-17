import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { useCart } from "@/contexts/CartContext";
import CartItem from "./CartItem";
import { formatPrice } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface CartSlideoutProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSlideout = ({ isOpen, onClose }: CartSlideoutProps) => {
  // Set default values
  let cartItems: any[] = [];
  let totalItems = 0;
  let totalPrice = 0;
  let clearCart = () => Promise.resolve();
  let isLoading = false;
  
  try {
    const cartContext = useCart();
    cartItems = cartContext.cartItems;
    totalItems = cartContext.totalItems;
    totalPrice = cartContext.totalPrice;
    clearCart = cartContext.clearCart;
    isLoading = cartContext.isLoading;
  } catch (error) {
    console.error("Cart context not available:", error);
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Your Cart ({totalItems} items)</SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-4">Looks like you haven't added any items to your cart yet.</p>
            <Button asChild onClick={onClose}>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-y-auto py-4">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            <div className="mt-auto pt-4">
              <Separator className="mb-4" />
              
              <div className="space-y-3">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                
                <SheetFooter className="flex-col sm:flex-col gap-2">
                  <Button asChild className="w-full" onClick={onClose}>
                    <Link href="/checkout">Checkout</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full" onClick={onClose}>
                    <Link href="/cart">View Cart</Link>
                  </Button>
                  {cartItems.length > 0 && (
                    <Button 
                      variant="ghost" 
                      className="w-full text-muted-foreground" 
                      onClick={() => clearCart()}
                      disabled={isLoading}
                    >
                      Clear Cart
                    </Button>
                  )}
                </SheetFooter>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSlideout;
