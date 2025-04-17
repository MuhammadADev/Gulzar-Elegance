import { Link } from "wouter";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-neutral-dark text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-display font-medium mb-4">About Gulzar</h3>
            <p className="mb-4 text-gray-300 text-sm">
              Gulzar brings you authentic Pakistani 3-piece suits with the finest 
              fabrics and exquisite craftsmanship, celebrating cultural heritage 
              with modern elegance.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-secondary transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-secondary transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-secondary transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-display font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link href="/" className="hover:text-secondary transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-secondary transition-colors">Shop</Link></li>
              <li><Link href="/products?collection=summer" className="hover:text-secondary transition-colors">Collections</Link></li>
              <li><Link href="/products?collection=bridal_collection" className="hover:text-secondary transition-colors">Bridal Collection</Link></li>
              <li><Link href="/products?sale=true" className="hover:text-secondary transition-colors">Sale</Link></li>
              <li><Link href="/contact" className="hover:text-secondary transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="text-xl font-display font-medium mb-4">Customer Service</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link href="/track-order" className="hover:text-secondary transition-colors">Track Order</Link></li>
              <li><Link href="/returns" className="hover:text-secondary transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/shipping" className="hover:text-secondary transition-colors">Shipping Information</Link></li>
              <li><Link href="/faq" className="hover:text-secondary transition-colors">FAQs</Link></li>
              <li><Link href="/size-guide" className="hover:text-secondary transition-colors">Size Guide</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-secondary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-xl font-display font-medium mb-4">Contact Us</h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="flex">
                <MapPin className="mt-1 mr-3 h-4 w-4 shrink-0" />
                <span>123 Fashion Street, Karachi, Pakistan</span>
              </li>
              <li className="flex">
                <Phone className="mt-1 mr-3 h-4 w-4 shrink-0" />
                <span>+92 (021) 1234 5678</span>
              </li>
              <li className="flex">
                <Mail className="mt-1 mr-3 h-4 w-4 shrink-0" />
                <span>customercare@gulzar.pk</span>
              </li>
              <li className="flex">
                <Clock className="mt-1 mr-3 h-4 w-4 shrink-0" />
                <span>Mon - Sat: 10:00 - 19:00</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-700 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">&copy; 2023 Gulzar. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <span className="text-sm text-gray-400">We Accept:</span>
              <div className="flex space-x-2">
                <svg className="h-8 w-auto" viewBox="0 0 780 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="780" height="500" fill="white"/>
                  <path d="M449.01 250.136C449.01 323.644 389.937 383.092 317.019 383.092C244.101 383.092 185.028 323.644 185.028 250.136C185.028 176.627 244.101 117.18 317.019 117.18C389.937 117.18 449.01 176.627 449.01 250.136Z" fill="#EB001B"/>
                  <path d="M594.01 250.136C594.01 323.644 534.937 383.092 462.019 383.092C389.101 383.092 330.029 323.644 330.029 250.136C330.029 176.627 389.101 117.18 462.019 117.18C534.937 117.18 594.01 176.627 594.01 250.136Z" fill="#F79E1B"/>
                  <path d="M483.985 172.541C458.111 192.174 442.771 219.575 442.771 250.136C442.771 280.697 458.111 308.098 483.985 327.731C509.859 308.098 525.199 280.697 525.199 250.136C525.199 219.575 509.859 192.174 483.985 172.541Z" fill="#FF5F00"/>
                </svg>
                <svg className="h-8 w-auto" viewBox="0 0 780 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="780" height="500" fill="white"/>
                  <path d="M290.41 172.321H489.58V327.92H290.41V172.321Z" fill="#FF5F00"/>
                  <path d="M311.78 250.121C311.78 219.351 325.56 191.961 347.07 172.321C329.65 158.321 307.87 149.991 284.09 149.991C226.72 149.991 180 196.711 180 254.081C180 311.451 226.72 358.171 284.09 358.171C307.87 358.171 329.65 349.841 347.07 335.841C325.56 316.311 311.78 288.801 311.78 250.121Z" fill="#EB001B"/>
                  <path d="M599.99 254.081C599.99 311.451 553.28 358.171 495.9 358.171C472.12 358.171 450.35 349.841 432.92 335.841C454.55 316.201 468.21 288.801 468.21 250.121C468.21 211.441 454.43 184.041 432.92 164.511C450.34 150.511 472.12 142.181 495.9 142.181C553.28 142.181 599.99 188.901 599.99 246.271V254.081Z" fill="#F79E1B"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
