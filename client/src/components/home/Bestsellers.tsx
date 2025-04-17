import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

const Bestsellers = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['/api/products?bestSeller=true&limit=4'],
  });

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-semibold font-display">Bestsellers</h2>
            <div className="w-24 h-1 bg-accent mt-1"></div>
          </div>
          <Link href="/products?bestSeller=true" className="text-primary hover:text-primary-dark flex items-center">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-3 bg-white rounded-lg shadow-sm p-3">
                <Skeleton className="h-[320px] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                className="bg-white rounded-lg shadow-sm p-3"
                badgeText="Bestseller"
                badgeVariant="accent"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Bestsellers;
