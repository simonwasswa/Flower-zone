import Hero from '../components/home/Hero';
import ShopByOccasion from '../components/home/ShopByOccasion';
import ClientStories from '../components/home/ClientStories';
import MostLoved from '../components/home/MostLoved';
import Ethos from '../components/home/Ethos';
import Newsletter from '../components/home/Newsletter';

export default function Home() {
  return (
    <>
      <Hero />
      <ShopByOccasion />
      <ClientStories />
      <MostLoved />
      <Ethos />
      <Newsletter />
    </>
  );
}
