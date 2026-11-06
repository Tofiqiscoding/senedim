import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Spotlight from "./components/Spotlight";
import Results from "./components/Results";
import HowItWorks from "./components/HowItWorks";
import Products from "./components/Products";
import PixelDivider from "./components/PixelDivider";
import Teams from "./components/Teams";
import Cta from "./components/Cta";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Spotlight />
        <Results />
        <HowItWorks />
        <Products />
        <PixelDivider />
        <Teams />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
