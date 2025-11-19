import React from "react";

const Footer: React.FC = () => {
  return (
    <footer
      id="support"
      className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-center md:flex-row md:px-8">
        <p>&copy; {new Date().getFullYear()} SHOP.ME. All rights reserved.</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href="#" className="hover:text-slate-700">
            Help centre
          </a>
          <a href="#" className="hover:text-slate-700">
            Shipping
          </a>
          <a href="#" className="hover:text-slate-700">
            Privacy
          </a>
          <a href="#" className="hover:text-slate-700">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
