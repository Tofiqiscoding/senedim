import DemoPicker from "./DemoPicker";
import Mosaic from "./Mosaic";
import { T } from "../i18n/LangProvider";

export default function Hero() {
  return (
    <section id="top" className="noise relative flex min-h-[100svh] flex-col">
      <Mosaic rows={4} cols={7} seed={7} />
      <div className="relative z-10 flex flex-1 items-center px-6 pb-12 pt-32 md:px-9">
        <h1 className="h-display rise max-w-[14ch] md:max-w-none">
          <T>Automate Every HR Process</T>
          <br />
          <span className="text-lime"><T>in One Portal</T></span>
        </h1>
      </div>
      <div className="relative z-10 grid border-t border-white/20 md:grid-cols-2">
        <div className="flex min-h-[260px] flex-col justify-between gap-10 border-b border-white/20 p-6 md:min-h-[300px] md:border-b-0 md:border-r md:px-9 md:py-9">
          <span className="md:pl-11"><T>Who We Are:</T></span>
          <p className="max-w-[18em] text-[clamp(1.25rem,2.2vw,2rem)] leading-[1.15] tracking-[-0.01em]">
            <T>Uniquely built HR workflow software that replaces paper, Word files and email chains with contracts, onboarding and approvals in one place</T>
          </p>
        </div>
        <div className="flex min-h-[260px] flex-col justify-between gap-10 p-6 md:min-h-[300px] md:px-9 md:py-9">
          <span className="md:pl-11"><T>Try the Demo</T></span>
          <DemoPicker id="demo" />
        </div>
      </div>
    </section>
  );
}
