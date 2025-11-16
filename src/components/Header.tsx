import React, { useState } from "react";

interface HeaderProps {
  cartCount: number;
  onCartToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-8">
        <a
          href="#top"
          className="font-serif text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl"
        >
          Shop.ME
        </a>

        <nav className="flex items-center gap-4">
          <div className="hidden items-center font-sen text-xs font-medium uppercase text-slate-300 md:text-sm lg:flex">
            <a href="#top" className="py-2 px-4 hover:text-slate-50">
              Home
            </a>
            <a href="#products" className="py-2 px-4 hover:text-slate-50">
              Shop
            </a>
            <a href="#highlights" className="py-2 px-4 hover:text-slate-50">
              Highlights
            </a>
            <a href="#support" className="py-2 px-4 hover:text-slate-50">
              Support
            </a>
          </div>

          <button
            type="button"
            aria-label="View cart"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-200 hover:border-amber-400 hover:text-amber-300"
            onClick={() => onCartToggle && onCartToggle()}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4"
            >
              <path
                d="M7 4h-.5a1.5 1.5 0 0 0 0 3H7m0-3h10.5a1.5 1.5 0 0 1 0 3H7m0-3v3m2 15a1 1 0 1 1-2 0m12 0a1 1 0 1 1-2 0M5 7l1.5 9.5A1.5 1.5 0 0 0 8 18h8a1.5 1.5 0 0 0 1.48-1.23L18.5 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-semibold text-slate-950">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            aria-label="Toggle navigation"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-200 hover:border-slate-500 hover:text-slate-50 lg:hidden"
            onClick={() => setIsOpen((open) => !open)}
          >
            <span className="block h-[2px] w-5 bg-current" />
            <span className="mt-1 block h-[2px] w-5 bg-current" />
            <span className="mt-1 block h-[2px] w-5 bg-current" />
          </button>
        </nav>
      </div>

      {isOpen && (
        <div className="border-t border-slate-800 bg-slate-950 px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-2 text-sm font-medium text-slate-100">
            <a href="#top" className="py-1">
              Home
            </a>
            <a href="#products" className="py-1">
              Shop
            </a>
            <a href="#highlights" className="py-1">
              Highlights
            </a>
            <a href="#support" className="py-1">
              Support
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
