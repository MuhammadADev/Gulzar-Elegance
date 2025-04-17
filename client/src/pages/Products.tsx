import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import ProductFilters from "@/components/products/ProductFilters";
import ProductGrid from "@/components/products/ProductGrid";

const Products = ({ params }: { params?: { category?: string } }) => {
  const [location] = useLocation();
  const [title, setTitle] = useState("All Products");
  
  // Parse URL query parameters
  const searchParams = new URLSearchParams(window.location.search);
  const category = params?.category || searchParams.get("category") || "";
  const collection = searchParams.get("collection") || "";
  const priceRange = searchParams.get("priceRange") || "";
  const sortBy = searchParams.get("sortBy") || "featured";
  const sale = searchParams.get("sale") === "true";
  const inStock = searchParams.get("inStock") === "true";
  const search = searchParams.get("search") || "";
  const newArrival = searchParams.get("newArrival") === "true";
  const bestSeller = searchParams.get("bestSeller") === "true";
  
  // Build API query URL
  const buildQueryUrl = () => {
    const queryParams = new URLSearchParams();
    
    if (category) queryParams.append("category", category);
    if (collection) queryParams.append("collection", collection);
    if (newArrival) queryParams.append("newArrival", "true");
    if (bestSeller) queryParams.append("bestSeller", "true");
    if (sale) queryParams.append("sale", "true");
    if (inStock) queryParams.append("inStock", "true");
    if (search) queryParams.append("search", search);
    
    // Handle price range
    if (priceRange) {
      const [_, rangeName, min, max] = priceRange.match(/price-(\d+)-(\d+)-(\d+)/) || [];
      if (min && max) {
        queryParams.append("minPrice", min);
        queryParams.append("maxPrice", max);
      }
    }
    
    // Handle sorting
    if (sortBy) {
      switch (sortBy) {
        case "price-low":
          queryParams.append("sort", "price-asc");
          break;
        case "price-high":
          queryParams.append("sort", "price-desc");
          break;
        case "newest":
          queryParams.append("sort", "created-desc");
          break;
        case "best-selling":
          queryParams.append("sort", "best-seller");
          break;
        default:
          queryParams.append("sort", "featured");
      }
    }
    
    return `/api/products?${queryParams.toString()}`;
  };
  
  const queryUrl = buildQueryUrl();
  
  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: [queryUrl],
  });
  
  // Set page title based on filters
  useEffect(() => {
    if (search) {
      setTitle(`Search Results for "${search}"`);
    } else if (category) {
      setTitle(category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
    } else if (collection) {
      setTitle(collection.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + " Collection");
    } else if (newArrival) {
      setTitle("New Arrivals");
    } else if (bestSeller) {
      setTitle("Bestsellers");
    } else if (sale) {
      setTitle("Sale Items");
    } else {
      setTitle("All Products");
    }
  }, [category, collection, search, newArrival, bestSeller, sale]);

  return (
    <>
      <Helmet>
        <title>{title} | Gulzar</title>
        <meta name="description" content={`Shop ${title.toLowerCase()} at Gulzar. Premium Pakistani women's 3-piece clothing sets.`} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-semibold">{title}</h1>
          {search && <p className="text-muted-foreground mt-2">Showing results for "{search}"</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <ProductFilters 
              initialFilters={{
                category,
                collection,
                priceRange,
                sortBy,
                sale,
                inStock,
                search
              }}
            />
          </div>
          
          <div className="md:col-span-3">
            <ProductGrid products={products || []} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
