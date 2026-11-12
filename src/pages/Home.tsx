import Hero from '../components/home/Hero';
import WhyUs from '../components/home/WhyUs';
import Catalog from '../components/home/Catalog';
import Delivery from '../components/home/Delivery';
import OccasionRibbon from '../components/home/OccasionRibbon';

export default function Home() {
  return (
    <>
      <Hero />
      <WhyUs />
      <OccasionRibbon />
      <Catalog />
      <Delivery />
    </>
  );
}
