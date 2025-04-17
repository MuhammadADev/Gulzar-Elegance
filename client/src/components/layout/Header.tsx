import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useQuery } from "@tanstack/react-query";
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import CartSlideout from "@/components/cart/CartSlideout";
import { mainNavLinks, collectionsDropdown, categoriesDropdown } from "@/lib/constants";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Use try/catch to handle potential context errors
  let totalItems = 0;
  let wishlistItems = 0;
  
  try {
    const { totalItems: cartTotal } = useCart();
    totalItems = cartTotal;
  } catch (error) {
    console.error("Cart context not available:", error);
  }
  
  try {
    const { totalItems: wishlistTotal } = useWishlist();
    wishlistItems = wishlistTotal;
  } catch (error) {
    console.error("Wishlist context not available:", error);
  }
  
  // Check if user is logged in
  const { data: user } = useQuery({ 
    queryKey: ['/api/user'],
    retry: false,
    staleTime: 300000, // 5 minutes
    enabled: typeof window !== 'undefined'
  });

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  return (
    <header className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      {/* Top announcement bar */}
      <div className="bg-primary text-white text-center py-2 px-4 text-sm">
        <p>Free Shipping on Orders Over ₨5,000 | Get 10% Off Your First Order with Code: WELCOME10</p>
      </div>
      
      {/* Main header with navigation */}
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-primary font-display">Gulzar</h1>
            <span className="ml-1 text-xs text-secondary">ELEGANCE</span>
          </Link>
          <button 
            className="md:hidden text-neutral-dark" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
        
        {/* Search bar */}
        <form 
          onSubmit={handleSearch}
          className="hidden md:flex items-center bg-neutral-light rounded-full px-3 py-1 w-full max-w-md"
        >
          <Search className="text-neutral-dark mr-2 h-4 w-4" />
          <Input 
            type="text" 
            placeholder="Search for suits, colors, styles..." 
            className="bg-transparent border-none focus:outline-none w-full text-sm ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        
        {/* Navigation icons */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href={user ? "/account" : "/login"} className="text-neutral-dark hover:text-primary transition-colors flex flex-col items-center">
            <User className="h-5 w-5" />
            <span className="text-xs block mt-1">{user ? "Account" : "Login"}</span>
          </Link>
          <Link href="/wishlist" className="text-neutral-dark hover:text-primary transition-colors flex flex-col items-center relative">
            <Heart className="h-5 w-5" />
            <span className="text-xs block mt-1">Wishlist</span>
            {wishlistItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {wishlistItems > 99 ? '99+' : wishlistItems}
              </span>
            )}
          </Link>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="text-neutral-dark hover:text-primary transition-colors flex flex-col items-center relative"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-xs block mt-1">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {/* Category navigation */}
      <nav className="hidden md:block border-t border-neutral-light">
        <div className="container mx-auto px-4">
          <ul className="flex space-x-8 py-3 justify-center text-sm">
            {mainNavLinks.map((link, index) => (
              <li key={index} className={link.hasDropdown ? "group relative" : ""}>
                <Link 
                  href={link.path} 
                  className={`hover:text-primary font-medium flex items-center ${link.highlight ? 'text-secondary' : ''} ${location === link.path ? 'text-primary' : ''}`}
                >
                  {link.name} 
                  {link.hasDropdown && <ChevronDown className="ml-1 h-3 w-3" />}
                </Link>
                
                {link.hasDropdown && link.name === "Collections" && (
                  <div className="absolute left-0 top-full bg-white shadow-lg p-4 rounded w-64 hidden group-hover:block z-10">
                    <ul className="space-y-2">
                      {collectionsDropdown.map((item, idx) => (
                        <li key={idx}>
                          <Link href={item.path} className="hover:text-primary block py-1">
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {link.hasDropdown && link.name === "Categories" && (
                  <div className="absolute left-0 top-full bg-white shadow-lg p-4 rounded w-64 hidden group-hover:block z-10">
                    <ul className="space-y-2">
                      {categoriesDropdown.map((item, idx) => (
                        <li key={idx}>
                          <Link href={item.path} className="hover:text-primary block py-1">
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-4 py-3 bg-neutral-light">
          <form onSubmit={handleSearch} className="flex items-center bg-white rounded-full px-3 py-2">
            <Search className="text-neutral-dark mr-2 h-4 w-4" />
            <Input 
              type="text" 
              placeholder="Search products..." 
              className="bg-transparent border-none focus:outline-none w-full text-sm ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
        <nav className="px-4 py-2">
          <ul className="space-y-1">
            {mainNavLinks.map((link, index) => (
              <li key={index}>
                <Link 
                  href={link.path} 
                  className={`block py-2 font-medium ${link.highlight ? 'text-secondary' : ''} ${location === link.path ? 'text-primary' : ''}`}
                  onClick={() => {
                    if (!link.hasDropdown) {
                      setIsMenuOpen(false);
                    }
                  }}
                >
                  {link.name}
                </Link>
                
                {link.hasDropdown && link.name === "Collections" && (
                  <ul className="pl-4 space-y-1 text-sm">
                    {collectionsDropdown.map((item, idx) => (
                      <li key={idx}>
                        <Link 
                          href={item.path} 
                          className="block py-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                
                {link.hasDropdown && link.name === "Categories" && (
                  <ul className="pl-4 space-y-1 text-sm">
                    {categoriesDropdown.map((item, idx) => (
                      <li key={idx}>
                        <Link 
                          href={item.path} 
                          className="block py-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-neutral-light px-4 py-3 flex justify-around">
          <Link href={user ? "/account" : "/login"} className="text-center text-neutral-dark flex flex-col items-center" onClick={() => setIsMenuOpen(false)}>
            <User className="h-5 w-5" />
            <span className="text-xs block mt-1">{user ? "Account" : "Login"}</span>
          </Link>
          <Link href="/wishlist" className="text-center text-neutral-dark flex flex-col items-center relative" onClick={() => setIsMenuOpen(false)}>
            <Heart className="h-5 w-5" />
            <span className="text-xs block mt-1">Wishlist</span>
            {wishlistItems > 0 && (
              <span className="absolute -top-1 right-1/4 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {wishlistItems}
              </span>
            )}
          </Link>
          <button 
            onClick={() => {
              setIsCartOpen(true);
              setIsMenuOpen(false);
            }}
            className="text-center text-neutral-dark flex flex-col items-center relative"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-xs block mt-1">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 right-1/4 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Cart Slideout */}
      <CartSlideout isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header;
