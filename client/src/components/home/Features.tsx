import { Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { features } from "@/lib/constants";

const FeatureIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'truck':
      return <Truck className="text-primary text-xl" />;
    case 'undo':
      return <RotateCcw className="text-primary text-xl" />;
    case 'shield-check':
      return <ShieldCheck className="text-primary text-xl" />;
    default:
      return null;
  }
};

const Features = () => {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="text-center">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <FeatureIcon icon={feature.icon} />
              </div>
              <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
              <p className="text-neutral-dark text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
