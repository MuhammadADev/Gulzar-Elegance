import React, { useState } from "react";
import { useLocation } from "wouter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoriesDropdown, sortOptions, priceRanges, collectionsDropdown } from "@/lib/constants";
import { Filter, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface ProductFiltersProps {
  initialFilters?: {
    category?: string;
    collection?: string;
    priceRange?: string;
    sortBy?: string;
    sale?: boolean;
    inStock?: boolean;
    search?: string;
  };
}

const ProductFilters = ({ initialFilters = {} }: ProductFiltersProps) => {
  const [, setLocation] = useLocation();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    category: initialFilters.category || "",
    collection: initialFilters.collection || "",
    priceRange: initialFilters.priceRange || "",
    sortBy: initialFilters.sortBy || "featured",
    sale: initialFilters.sale || false,
    inStock: initialFilters.inStock || false,
    search: initialFilters.search || "",
  });

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const queryParams = new URLSearchParams();
    
    if (filters.category) queryParams.set("category", filters.category);
    if (filters.collection) queryParams.set("collection", filters.collection);
    if (filters.priceRange) queryParams.set("priceRange", filters.priceRange);
    if (filters.sortBy) queryParams.set("sortBy", filters.sortBy);
    if (filters.sale) queryParams.set("sale", "true");
    if (filters.inStock) queryParams.set("inStock", "true");
    if (filters.search) queryParams.set("search", filters.search);
    
    setLocation(`/products?${queryParams.toString()}`);
    setMobileFiltersOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      collection: "",
      priceRange: "",
      sortBy: "featured",
      sale: false,
      inStock: false,
      search: filters.search, // Preserve search term
    });
    
    // If there's a search term, keep it in the URL
    const queryParams = new URLSearchParams();
    if (filters.search) queryParams.set("search", filters.search);
    
    setLocation(`/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
    setMobileFiltersOpen(false);
  };

  const FiltersContent = () => (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Sort By</h3>
          <Select 
            value={filters.sortBy} 
            onValueChange={(value) => handleFilterChange("sortBy", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort products" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Accordion type="single" collapsible defaultValue="category">
          <AccordionItem value="category">
            <AccordionTrigger>Categories</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {categoriesDropdown.map((category) => (
                  <div key={category.path} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category.path}`} 
                      checked={filters.category === category.path.split('/').pop()}
                      onCheckedChange={() => handleFilterChange("category", category.path.split('/').pop() || "")}
                    />
                    <label 
                      htmlFor={`category-${category.path}`}
                      className="text-sm cursor-pointer"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="collection">
            <AccordionTrigger>Collections</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {collectionsDropdown.map((collection) => (
                  <div key={collection.path} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`collection-${collection.path}`} 
                      checked={filters.collection === collection.path.split('=').pop()}
                      onCheckedChange={() => handleFilterChange("collection", collection.path.split('=').pop() || "")}
                    />
                    <label 
                      htmlFor={`collection-${collection.path}`}
                      className="text-sm cursor-pointer"
                    >
                      {collection.name}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <div key={range.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={range.id} 
                      checked={filters.priceRange === range.id}
                      onCheckedChange={() => handleFilterChange("priceRange", range.id)}
                    />
                    <label 
                      htmlFor={range.id}
                      className="text-sm cursor-pointer"
                    >
                      {range.label}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="sale" 
              checked={filters.sale}
              onCheckedChange={(checked) => handleFilterChange("sale", !!checked)}
            />
            <label 
              htmlFor="sale"
              className="text-sm cursor-pointer"
            >
              On Sale
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="inStock" 
              checked={filters.inStock}
              onCheckedChange={(checked) => handleFilterChange("inStock", !!checked)}
            />
            <label 
              htmlFor="inStock"
              className="text-sm cursor-pointer"
            >
              In Stock Only
            </label>
          </div>
        </div>
        
        <div className="flex space-x-2 pt-4">
          <Button onClick={applyFilters} className="flex-1">Apply Filters</Button>
          <Button variant="outline" onClick={clearFilters}>Clear</Button>
        </div>
      </div>
    </>
  );

  return (
    <div className="mb-8">
      {/* Desktop filters */}
      <div className="hidden md:block">
        <div className="grid grid-cols-1 gap-6">
          <FiltersContent />
        </div>
      </div>

      {/* Mobile filters */}
      <div className="md:hidden">
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" /> Filters & Sort
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Filters & Sort</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <FiltersContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default ProductFilters;
