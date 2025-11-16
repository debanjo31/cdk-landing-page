import React, { useMemo, useState } from "react";
import productsData from "../../data/product.json";

type RawProduct = {
  name: string;
  price: string;
  proudct_url?: string;
  product_url?: string;
  img: string;
};

export type NormalizedProduct = {
  name: string;
  priceLabel: string;
  url: string;
  img: string;
  numericPrice: number | null;
};

const normalizeProduct = (product: RawProduct): NormalizedProduct => {
  const priceLabel = product.price;
  const digits = priceLabel.replace(/[^\d]/g, "");
  const numericPrice = digits ? Number.parseInt(digits, 10) : null;

  return {
    name: product.name,
    priceLabel,
    url: product.product_url ?? product.proudct_url ?? "#",
    img: product.img,
    numericPrice: Number.isNaN(numericPrice) ? null : numericPrice,
  };
};

const rawProducts = productsData as RawProduct[];
const normalizedProducts: NormalizedProduct[] = rawProducts.map(normalizeProduct);

interface ProductGridProps {
  onAddToCart?: (product: NormalizedProduct) => void;
  cartQuantities?: Record<string, number>;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  onAddToCart,
  cartQuantities,
}) => {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc">(
    "featured",
  );

  const visibleProducts = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();

    let list = normalizedProducts;

    if (trimmedQuery) {
      list = list.filter((product) =>
        product.name.toLowerCase().includes(trimmedQuery),
      );
    }

    if (sort !== "featured") {
      const sorted = [...list];
      sorted.sort((a, b) => {
        const aPrice = a.numericPrice ?? Number.MAX_SAFE_INTEGER;
        const bPrice = b.numericPrice ?? Number.MAX_SAFE_INTEGER;

        if (sort === "price-asc") {
          return aPrice - bPrice;
        }

        return bPrice - aPrice;
      });

      return sorted;
    }

    return list;
  }, [query, sort]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
            Today&apos;s picks
          </h2>
          <p className="mt-1 text-xs text-slate-600 md:text-sm">
            Curated items sourced from a live marketplace feed.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-xs md:flex-row md:items-center">
          <label className="flex items-center gap-2">
            <span className="whitespace-nowrap text-slate-600">Search</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              className="h-8 w-full rounded-full border border-slate-300 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 md:w-56"
            />
          </label>

          <label className="flex items-center gap-2">
            <span className="whitespace-nowrap text-slate-600">Sort</span>
            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as typeof sort)
              }
              className="h-8 rounded-full border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:mt-6 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {visibleProducts.map((product) => {
          const key = product.name + product.url;
          const quantityInCart = cartQuantities?.[key] ?? 0;

          return (
            <article
              key={key}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={product.img}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col px-3 pb-3 pt-2">
                <h3 className="line-clamp-2 text-xs font-medium text-slate-900 md:text-sm">
                  {product.name}
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-900 md:text-sm">
                  {product.priceLabel}
                </p>
                {quantityInCart > 0 && (
                  <p className="mt-0.5 text-[11px] font-medium text-emerald-700">
                    In cart · {quantityInCart}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between gap-2 text-[11px]">
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-300 px-3 py-1 font-medium text-slate-700 hover:border-slate-400 hover:text-slate-900"
                  >
                    View details
                  </a>
                  <button
                    type="button"
                    onClick={() => onAddToCart?.(product)}
                    className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-900 px-3 py-1 font-semibold text-white hover:bg-slate-800"
                  >
                    {quantityInCart > 0 ? "Add +1" : "Add to cart"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {visibleProducts.length === 0 && (
        <p className="mt-6 text-xs text-slate-500">
          No products match that search yet. Try another term.
        </p>
      )}
    </div>
  );
};

export default ProductGrid;
