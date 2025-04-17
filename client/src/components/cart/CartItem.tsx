import { useState } from "react";
import { Link } from "wouter";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";

interface CartItemProps {
  item: any;
}

const CartItem = ({ item }: CartItemProps) => {
  // Set default values
  let updateItemQuantity = (_id: number, _qty: number) => Promise.resolve();
  let removeItem = (_id: number) => Promise.resolve();
  let isLoading = false;
  
  try {
    const cartContext = useCart();
    updateItemQuantity = cartContext.updateItemQuantity;
    removeItem = cartContext.removeItem;
    isLoading = cartContext.isLoading;
  } catch (error) {
    console.error("Cart context not available in CartItem:", error);
  }
  
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  // Get product details from the item
  const product = item.product;
  const variant = item.variant;

  // Handle quantity input change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue) && newValue > 0) {
      setQuantity(newValue);
      handleUpdateQuantity(newValue);
    }
  };

  // Handle incrementing quantity
  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    handleUpdateQuantity(newQuantity);
  };

  // Handle decrementing quantity
  const decrementQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      handleUpdateQuantity(newQuantity);
    }
  };

  // Update quantity with debounce
  const handleUpdateQuantity = (newQuantity: number) => {
    if (isUpdating) return;

    setIsUpdating(true);
    const timer = setTimeout(() => {
      updateItemQuantity(item.id, newQuantity);
      setIsUpdating(false);
    }, 500);

    return () => {
      clearTimeout(timer);
      setIsUpdating(false);
    };
  };

  // Handle item removal
  const handleRemoveItem = () => {
    removeItem(item.id);
  };

  if (!product) return null;

  return (
    <div className="flex border-b border-gray-200 pb-4 mb-4">
      <Link href={`/product/${product.id}`} className="block w-20 h-24 rounded-md overflow-hidden">
        <img
          src={product.thumbnailImage}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </Link>
      <div className="ml-4 flex-grow">
        <div className="flex justify-between mb-1">
          <Link href={`/product/${product.id}`} className="font-medium text-sm hover:text-primary">
            {product.name}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-neutral-dark hover:text-destructive"
            onClick={handleRemoveItem}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        {variant && (
          <>
            {variant.size && <div className="text-sm text-neutral-dark">Size: {variant.size}</div>}
            {variant.color && <div className="text-sm text-neutral-dark">Color: {variant.color}</div>}
          </>
        )}
        
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center border border-gray-200 rounded">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 p-0"
              onClick={decrementQuantity}
              disabled={isLoading || quantity <= 1}
            >
              <span className="text-sm">-</span>
            </Button>
            <Input
              type="text"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-8 text-center border-none h-7 p-0 text-sm"
              disabled={isLoading}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 p-0"
              onClick={incrementQuantity}
              disabled={isLoading}
            >
              <span className="text-sm">+</span>
            </Button>
          </div>
          <div className="font-medium">{formatPrice(item.price * item.quantity)}</div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
