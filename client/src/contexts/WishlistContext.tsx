import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface WishlistItem {
  id: number;
  productId: number;
  wishlistId: number;
  addedAt: string;
  product?: {
    id: number;
    name: string;
    thumbnailImage: string;
    price: number;
    salePrice?: number | null;
    category: string;
  };
}

interface Wishlist {
  id: number;
  userId: number;
  createdAt: string;
}

interface WishlistContextType {
  wishlist: Wishlist | null;
  wishlistItems: WishlistItem[];
  isLoading: boolean;
  isLoggedIn: boolean;
  totalItems: number;
  addItem: (productId: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  const totalItems = wishlistItems.length;

  // Fetch wishlist on component mount
  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest("GET", "/api/wishlist");
      const data = await response.json();
      setWishlist(data.wishlist);
      setWishlistItems(data.items);
      setIsLoggedIn(true);
    } catch (error) {
      // If 401, user is not logged in
      if ((error as any).status === 401) {
        setIsLoggedIn(false);
      } else {
        console.error("Error fetching wishlist:", error);
        toast({
          title: "Error",
          description: "Could not fetch your wishlist. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (productId: number) => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please log in to add items to your wishlist.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiRequest("POST", "/api/wishlist/items", { productId });
      const data = await response.json();
      setWishlist(data.wishlist);
      setWishlistItems(data.items);
      toast({
        title: "Added to wishlist",
        description: "The item has been added to your wishlist.",
      });
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
      toast({
        title: "Error",
        description: "Could not add item to wishlist. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (productId: number) => {
    try {
      setIsLoading(true);
      const response = await apiRequest("DELETE", `/api/wishlist/items/${productId}`);
      const data = await response.json();
      setWishlist(data.wishlist);
      setWishlistItems(data.items);
      toast({
        title: "Item removed",
        description: "The item has been removed from your wishlist.",
      });
    } catch (error) {
      console.error("Error removing wishlist item:", error);
      toast({
        title: "Error",
        description: "Could not remove item from wishlist. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlistItems.some(item => item.productId === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistItems,
        isLoading,
        isLoggedIn,
        totalItems,
        addItem,
        removeItem,
        isInWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    console.error("Wishlist context not available:", new Error("useWishlist must be used within a WishlistProvider"));
    // Return a safe fallback object with empty values and no-op functions
    return {
      wishlist: null,
      wishlistItems: [],
      isLoading: false,
      isLoggedIn: false,
      totalItems: 0,
      addItem: async () => {},
      removeItem: async () => {},
      isInWishlist: () => false
    };
  }
  return context;
}
