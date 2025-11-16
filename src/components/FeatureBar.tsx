import React from "react";

const FeatureBar: React.FC = () => {
  return (
    <section
      id="highlights"
      className="grid gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-800 shadow-sm md:grid-cols-3 md:px-6 md:py-5"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
          1
        </span>
        <div>
          <p className="font-semibold">Fast delivery</p>
          <p className="mt-0.5 text-xs text-slate-600">
            Same-day dispatch on orders placed before 2pm.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
          2
        </span>
        <div>
          <p className="font-semibold">Simple returns</p>
          <p className="mt-0.5 text-xs text-slate-600">
            7-day return window on most items you see here.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
          3
        </span>
        <div>
          <p className="font-semibold">Secure checkout</p>
          <p className="mt-0.5 text-xs text-slate-600">
            Card details are encrypted end-to-end at checkout.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeatureBar;
