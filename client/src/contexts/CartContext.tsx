import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  variantId?: number | null;
  product?: {
    id: number;
    name: string;
    thumbnailImage: string;
    price: number;
    salePrice?: number | null;
  };
  variant?: {
    id: number;
    color?: string | null;
    size?: string | null;
  } | null;
}

interface Cart {
  id: number;
  sessionId: string;
  userId: number | null;
  createdAt: string;
  updatedAt: string;
}

interface CartContextType {
  cart: Cart | null;
  cartItems: CartItem[];
  isLoading: boolean;
  totalItems: number;
  totalPrice: number;
  addItem: (productId: number, quantity: number, variantId?: number) => Promise<void>;
  updateItemQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Fetch cart on component mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest("GET", "/api/cart");
      const data = await response.json();
      setCart(data.cart);
      setCartItems(data.items);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast({
        title: "Error",
        description: "Could not fetch your cart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (productId: number, quantity: number, variantId?: number) => {
    try {
      setIsLoading(true);
      const response = await apiRequest("POST", "/api/cart/items", {
        productId,
        quantity,
        variantId: variantId || null
      });
      const data = await response.json();
      setCart(data.cart);
      setCartItems(data.items);
      toast({
        title: "Added to cart",
        description: "The item has been added to your cart.",
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast({
        title: "Error",
        description: "Could not add item to cart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateItemQuantity = async (itemId: number, quantity: number) => {
    try {
      setIsLoading(true);
      const response = await apiRequest("PATCH", `/api/cart/items/${itemId}`, { quantity });
      const data = await response.json();
      setCart(data.cart);
      setCartItems(data.items);
    } catch (error) {
      console.error("Error updating cart item:", error);
      toast({
        title: "Error",
        description: "Could not update item quantity. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      setIsLoading(true);
      const response = await apiRequest("DELETE", `/api/cart/items/${itemId}`);
      const data = await response.json();
      setCart(data.cart);
      setCartItems(data.items);
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      });
    } catch (error) {
      console.error("Error removing cart item:", error);
      toast({
        title: "Error",
        description: "Could not remove item from cart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest("DELETE", "/api/cart");
      const data = await response.json();
      setCart(data.cart);
      setCartItems(data.items);
      toast({
        title: "Cart cleared",
        description: "Your cart has been cleared.",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        title: "Error",
        description: "Could not clear your cart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        isLoading,
        totalItems,
        totalPrice,
        addItem,
        updateItemQuantity,
        removeItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    console.error("Cart context not available:", new Error("useCart must be used within a CartProvider"));
    // Return a safe fallback object with empty values and no-op functions
    return {
      cart: null,
      cartItems: [],
      isLoading: false,
      totalItems: 0,
      totalPrice: 0,
      addItem: async () => {},
      updateItemQuantity: async () => {},
      removeItem: async () => {},
      clearCart: async () => {}
    };
  }
  return context;
}
