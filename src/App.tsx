import { useState } from "react";
import "./App.css";
import Hero from "./components/Hero";
import Header from "./components/Header";
import ProductGrid, { type NormalizedProduct } from "./components/ProductGrid";
import FeatureBar from "./components/FeatureBar";
import Footer from "./components/Footer";

type CartItem = {
  product: NormalizedProduct;
  quantity: number;
};

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (product: NormalizedProduct) => {
    setCart((current) => {
      const existing = current.find(
        (item) =>
          item.product.url === product.url && item.product.name === product.name,
      );

      if (existing) {
        return current.map((item) =>
          item === existing
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...current, { product, quantity: 1 }];
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (sum, item) =>
      sum + (item.product.numericPrice ?? 0) * item.quantity,
    0,
  );
  const cartQuantities = cart.reduce<Record<string, number>>(
    (acc, item) => {
      const key = item.product.name + item.product.url;
      acc[key] = (acc[key] ?? 0) + item.quantity;
      return acc;
    },
    {},
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header
        cartCount={cartCount}
        onCartToggle={() => setIsCartOpen((open) => !open)}
      />
      <Hero />

      {isCartOpen && (
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-4 text-sm text-slate-900 lg:px-8">
            <h2 className="text-sm font-semibold tracking-tight text-slate-900">
              Cart
            </h2>
            {cart.length === 0 ? (
              <p className="mt-2 text-xs text-slate-500">
                Your cart is empty for now. Add a few items to get started.
              </p>
            ) : (
              <div className="mt-3 space-y-2">
                <ul className="space-y-2">
                  {cart.map((item) => (
                    <li
                      key={item.product.name + item.product.url}
                      className="flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.img}
                          alt={item.product.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                        <div>
                          <p className="line-clamp-1 font-medium text-slate-900">
                            {item.product.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Qty {item.quantity} · {item.product.priceLabel}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-2 text-xs">
                  <span className="text-slate-600">Estimated subtotal</span>
                  <span className="font-semibold text-slate-900">
                    {cartSubtotal > 0
                      ? cartSubtotal.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })
                      : "$0.00"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-16 pt-10 lg:px-8">
        <FeatureBar />
        <section id="products" aria-label="Product listings">
          <ProductGrid
            onAddToCart={handleAddToCart}
            cartQuantities={cartQuantities}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
