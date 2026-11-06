import Link from "next/link";
import DemoPicker from "./DemoPicker";
import { T } from "../i18n/LangProvider";

export default function Cta() {
  return (
    <section className="relative">
      <div className="relative flex min-h-[440px] items-end overflow-hidden bg-gradient-to-br from-[#0033cc] via-[#168ae2] to-[#35c9f5] px-6 py-12 md:min-h-[500px] md:px-9">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.4)_1px,transparent_1px)] [background-size:110px_110px]" />
        <div className="absolute -right-24 top-0 h-[120%] w-[40%] -skew-x-12 bg-ink/70 blur-[2px]" />
        <h2 className="h-display relative z-10">
          <T>Skip the Paperwork.</T>
          <br />
          <span className="text-lime"><T>Forever.</T></span>
        </h2>
      </div>
      <div className="grid md:grid-cols-2">
        <div className="flex min-h-[260px] flex-col justify-between gap-10 bg-gradient-to-r from-[#0033cc] to-ink p-6 md:min-h-[300px] md:px-9 md:py-9">
          <span className="md:pl-11"><T>Test the Demo</T></span>
          <DemoPicker />
        </div>
        <div className="flex min-h-[260px] flex-col justify-between gap-10 bg-lime p-6 text-ink md:min-h-[300px] md:px-9 md:py-9">
          <span><T>See It in Action</T></span>
          <Link
            href="/login"
            className="self-end border-b-[3px] border-current text-[clamp(2rem,3.9vw,4rem)] leading-[1.05] tracking-[-0.03em]"
          >
            <T>Go to demo</T>
          </Link>
        </div>
      </div>
    </section>
  );
}
