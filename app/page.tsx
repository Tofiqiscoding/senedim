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
import Reveal from "./components/Reveal";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Reveal>
          <Spotlight />
        </Reveal>
        <Reveal>
          <Results />
        </Reveal>
        <Reveal>
          <HowItWorks />
        </Reveal>
        <Reveal>
          <Products />
        </Reveal>
        <Reveal>
          <PixelDivider />
        </Reveal>
        <Reveal>
          <Teams />
        </Reveal>
        <Reveal>
          <Cta />
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
