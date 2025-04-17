import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import ProductCardFallback from "@/components/products/ProductCardFallback";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorBoundary from "@/components/ui/error-boundary";

const NewArrivals = () => {
  // Define proper type for products
  type Product = {
    id: number;
    name: string;
    price: number;
    thumbnailImage?: string;
    newArrival?: boolean;
    bestSeller?: boolean;
    featured?: boolean;
    salePrice?: number | null;
    averageRating?: number;
    reviewCount?: number;
    inStock?: boolean;
  };
  
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products?newArrival=true&limit=4'],
  });

  return (
    <section className="py-12 px-4 bg-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-semibold font-display">New Arrivals</h2>
            <div className="w-24 h-1 bg-accent mt-1"></div>
          </div>
          <Link href="/products?newArrival=true" className="text-primary hover:text-primary-dark flex items-center">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-[320px] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <ErrorBoundary key={product.id} fallback={<ProductCardFallback />}>
                  <ProductCard 
                    product={product} 
                    badgeText={product.newArrival ? "New" : ""}
                  />
                </ErrorBoundary>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                No new arrivals found
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;
