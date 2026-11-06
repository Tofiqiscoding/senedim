import Link from "next/link";
import DemoPicker from "./DemoPicker";
import { T } from "../i18n/LangProvider";

export default function Cta() {
  return (
    <section className="relative">
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
