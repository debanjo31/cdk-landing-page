import React from "react";

const Hero: React.FC = () => {
  return (
    <section id="top" className="relative overflow-hidden bg-slate-950">
      <div className="flex items-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
        <div className="container relative mx-auto flex px-6 py-16 lg:py-24">
          <div className="sm:w-2/3 lg:w-2/5 flex flex-col relative z-20">
            <span className="mb-6 h-0.5 w-16 bg-amber-400/80" />
            <h1
              id="hero-title"
              className="font-serif text-4xl font-semibold leading-tight tracking-tight text-slate-50 sm:text-6xl"
            >
              Shop better
              <span className="block text-3xl font-normal text-amber-300 sm:text-5xl">
                in one place
              </span>
            </h1>
            <p className="mt-4 text-sm text-slate-300 sm:text-base">
              Browse a curated mix of products from across the web, compare
              prices at a glance, and check out on the site that works best for
              you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#products"
                className="uppercase rounded-full bg-amber-400 px-5 py-2 text-xs font-semibold tracking-wide text-slate-950 hover:bg-amber-300"
              >
                Start shopping
              </a>
              <a
                href="#highlights"
                className="uppercase rounded-full border border-slate-500 px-5 py-2 text-xs font-semibold tracking-wide text-slate-100 hover:border-slate-300 hover:text-white"
              >
                Why Shop.ME?
              </a>
            </div>
          </div>
          <div className="relative hidden sm:block sm:w-1/3 lg:w-3/5">
            <img
              src="https://www.tailwind-kit.com/images/object/10.png"
              alt="Selection of modern products"
              className="m-auto max-w-xs rounded-3xl shadow-2xl md:max-w-sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
