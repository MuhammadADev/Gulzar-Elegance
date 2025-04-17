import { Helmet } from "react-helmet";
import HeroSlider from "@/components/home/HeroSlider";
import CategoryGrid from "@/components/home/CategoryGrid";
import NewArrivals from "@/components/home/NewArrivals";
import FeatureBanner from "@/components/home/FeatureBanner";
import Bestsellers from "@/components/home/Bestsellers";
import Features from "@/components/home/Features";
import Newsletter from "@/components/home/Newsletter";
import InstagramFeed from "@/components/home/InstagramFeed";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Gulzar - Pakistani Women's 3-Piece Clothing</title>
        <meta name="description" content="Discover authentic Pakistani 3-piece suits with exquisite craftsmanship. Shop our new arrivals, bestsellers, and festive collections." />
      </Helmet>
      
      <HeroSlider />
      <CategoryGrid />
      <NewArrivals />
      <FeatureBanner />
      <Bestsellers />
      <Features />
      <Newsletter />
      <InstagramFeed />
    </>
  );
};

export default Home;
