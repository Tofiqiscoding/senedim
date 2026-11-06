import Mosaic from "./Mosaic";
import ProductTour from "./ProductTour";
import { T } from "../i18n/LangProvider";

export default function Spotlight() {
  return (
    <section className="noise relative">
      <Mosaic rows={8} cols={7} seed={21} density={0.5} />
      <div className="relative z-10 px-6 pb-16 pt-32 md:px-9 md:pb-24 md:pt-40">
        <h2 className="h-display mb-12 md:mb-16">
          <T>Product Tour –</T>
          <br />
          <span className="text-lime"><T>From Offer to Day One</T></span>
        </h2>
        <ProductTour />
      </div>
    </section>
  );
}
