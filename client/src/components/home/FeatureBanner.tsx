import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const FeatureBanner = () => {
  return (
    <section className="relative py-12 px-4 overflow-hidden ornament">
      <div className="container mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1596367407372-96cb88503db6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Wedding Collection" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-semibold mb-6">Wedding Collection 2023</h2>
                <p className="text-neutral-dark mb-8">
                  Discover our exquisite range of bridal and festive wear for the upcoming wedding season. 
                  Handcrafted with love and adorned with intricate embroidery, each piece tells a story of 
                  tradition and elegance.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="default" className="rounded-full" asChild>
                    <Link href="/products?collection=wedding">Explore Collection</Link>
                  </Button>
                  <Button variant="outline-rounded" asChild>
                    <Link href="/products?collection=bridal_collection">View Lookbook</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureBanner;
