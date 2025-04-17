import { Skeleton } from "@/components/ui/skeleton";

const ProductCardFallback = () => {
  return (
    <div className="product-card-fallback">
      {/* Image placeholder */}
      <div className="relative overflow-hidden rounded-lg">
        <Skeleton className="aspect-[3/4] w-full h-full" />
      </div>
      
      {/* Content placeholder */}
      <div className="pt-4">
        <Skeleton className="h-5 w-3/4 mt-1" />
        <div className="flex justify-between items-center mt-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardFallback;