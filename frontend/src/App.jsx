import { useEffect, useState } from "react";
import axios from "axios";
import PaymentButton from "./PaymentButton";

const PRODUCT_URL = "http://localhost:3000/api/products/get-item";

function getProductErrorMessage(requestError) {
  return (
    requestError.response?.data?.message ||
    "We couldn’t load this product. Please try again."
  );
}

function Icon({ name, className = "size-5" }) {
  const shared = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 1.7,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  if (name === "bag") {
    return (
      <svg {...shared}>
        <path d="M5 8h14l1 12H4L5 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </svg>
    );
  }

  if (name === "arrow") {
    return (
      <svg {...shared}>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    );
  }

  if (name === "close") {
    return (
      <svg {...shared}>
        <path d="m18 6-12 12M6 6l12 12" />
      </svg>
    );
  }

  if (name === "plus") {
    return (
      <svg {...shared}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  }

  if (name === "minus") {
    return (
      <svg {...shared}>
        <path d="M5 12h14" />
      </svg>
    );
  }

  return null;
}

function formatPrice(amount, currency) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

function App() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartQuantity, setCartQuantity] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    axios
      .get(PRODUCT_URL)
      .then((response) => {
        if (isCurrent) setProduct(response.data.product);
      })
      .catch((requestError) => {
        if (isCurrent) setError(getProductErrorMessage(requestError));
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    if (!cartOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setCartOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [cartOpen]);

  const addToCart = (openCart = false) => {
    setCartQuantity((quantity) => quantity + 1);
    if (openCart) setCartOpen(true);
  };

  const currency = product?.price?.currency || "INR";
  const price =
    typeof product?.price?.amount === "number"
      ? formatPrice(product.price.amount, currency)
      : null;

  return (
    <div className="min-h-screen bg-[#24241b4c] text-[#20211e]">
      <div className="bg-[#1e2924] px-4 py-2.5 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-white sm:text-[11px]">
        Thoughtful things, made to last
      </div>

      <header className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 sm:px-10 lg:px-16">
        <a
          href="/"
          className="text-[17px] font-semibold tracking-[0.28em]"
          aria-label="Forma home"
        >
          FORMA<span className="text-[#829181]">.</span>
        </a>
        <p className="hidden text-[11px] font-medium uppercase tracking-[0.2em] text-[#858780] sm:block">
          Objects for everyday living
        </p>
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="group relative flex size-11 items-center justify-center rounded-full border border-[#e7e8e2] bg-white transition hover:border-[#1e2924]"
          aria-label={`Open cart, ${cartQuantity} items`}
        >
          <Icon name="bag" className="size-[19px]" />
          <span className="absolute -right-1 -top-1 flex size-[19px] items-center justify-center rounded-full bg-[#1e2924] text-[10px] font-medium text-white">
            {cartQuantity}
          </span>
        </button>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 pb-20 pt-3 sm:px-10 lg:px-16 lg:pt-8">
        <div className="mb-7 flex items-center gap-2 text-[11px] text-[#858780]">
          <span>Shop</span>
          <span aria-hidden="true">/</span>
          <span className="text-[#393b36]">Featured</span>
        </div>

        {loading ? (
          <div className="grid min-h-[480px] place-items-center rounded-2xl bg-[#eeefe9]">
            <div className="flex items-center gap-3 text-sm text-[#74776e]">
              <span className="size-4 animate-spin rounded-full border-2 border-[#c7cbc0] border-t-[#1e2924]" />
              Finding something good…
            </div>
          </div>
        ) : error ? (
          <div className="grid min-h-[480px] place-items-center rounded-2xl bg-[#eeefe9] px-6 text-center">
            <div className="max-w-sm">
              <p className="mb-2 text-lg font-medium">A little pause.</p>
              <p className="mb-6 text-sm leading-6 text-[#74776e]">{error}</p>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setError("");
                  axios
                    .get(PRODUCT_URL)
                    .then((response) => setProduct(response.data.product))
                    .catch((requestError) =>
                      setError(getProductErrorMessage(requestError)),
                    )
                    .finally(() => setLoading(false));
                }}
                className="rounded-full bg-[#1e2924] px-6 py-3 text-xs font-medium uppercase tracking-[0.12em] text-white transition hover:bg-[#34483d]"
              >
                Try again
              </button>
            </div>
          </div>
        ) : !product ? (
          <div className="grid min-h-[480px] place-items-center rounded-2xl bg-[#eeefe9] px-6 text-center">
            <div>
              <p className="mb-2 text-lg font-medium">Nothing here just yet.</p>
              <p className="text-sm text-[#74776e]">
                There isn’t a product available to view right now.
              </p>
            </div>
          </div>
        ) : (
          <section className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16">
            <div className="relative overflow-hidden rounded-2xl bg-[#e8e8e1]">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title || "Product"}
                  className="aspect-[1/1.03] w-full object-cover"
                />
              ) : (
                <div className="grid aspect-[1/1.03] place-items-center text-sm text-[#858780]">
                  Product image unavailable
                </div>
              )}
              <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[#4c5148] backdrop-blur">
                <span className="size-1.5 rounded-full bg-[#829181]" />
                Featured piece
              </div>
            </div>

            <div className="mx-auto w-full max-w-[510px] py-2 lg:mx-0 lg:pl-2">
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#829181]">
                The everyday edit
              </p>
              <h1 className="max-w-[470px] text-[38px] font-medium leading-[1.08] tracking-[-0.045em] sm:text-[52px]">
                {product.title || "Untitled product"}
              </h1>
              <p className="mt-5 max-w-[430px] text-[14px] leading-7 text-[#777a72] sm:text-[15px]">
                {product.description || "A considered piece for your everyday."}
              </p>

              <div className="my-8 flex items-baseline gap-3 border-y border-[#e4e5df] py-6">
                <p className="text-[25px] font-medium tracking-[-0.03em]">
                  {price || "Price unavailable"}
                </p>
                <p className="text-[11px] text-[#858780]">
                  {product.price?.currency || "INR"}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {/* <button
                  type="button"
                  onClick={() => addToCart(true)}
                  disabled={!price}
                  className="group flex min-h-14 flex-1 items-center justify-center gap-3 rounded-full bg-[#1e2924] px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#34483d] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Buy now
                  <Icon
                    name="arrow"
                    className="size-4 transition-transform group-hover:translate-x-1"
                  />
                </button> */}
                <PaymentButton/>
                <button
                  type="button"
                  onClick={() => addToCart()}
                  disabled={!price}
                  className="min-h-14 flex-1 rounded-full border border-[#d9dbd3] px-6 text-[11px] font-semibold uppercase tracking-[0.16em] transition hover:border-[#1e2924] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add to cart
                </button>
              </div>

              <div className="mt-8 flex items-center gap-3 text-[11px] text-[#858780]">
                <span className="flex size-7 items-center justify-center rounded-full border border-[#dfe1da]">
                  <Icon name="bag" className="size-3.5" />
                </span>
                Your cart is ready when you are.
              </div>
            </div>
          </section>
        )}
      </main>

      {cartOpen && (
        <div className="fixed inset-0 z-30">
          <button
            type="button"
            className="absolute inset-0 size-full cursor-default bg-[#151a17]/40 backdrop-blur-[2px]"
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-[#fbfbf8] px-6 pb-6 pt-7 shadow-2xl sm:px-8"
          >
            <div className="flex items-center justify-between border-b border-[#e7e8e2] pb-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#829181]">
                  Your selection
                </p>
                <h2
                  id="cart-title"
                  className="mt-1 text-[24px] font-medium tracking-[-0.04em]"
                >
                  Shopping bag
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="flex size-10 items-center justify-center rounded-full border border-[#e7e8e2] transition hover:border-[#1e2924]"
                aria-label="Close shopping bag"
              >
                <Icon name="close" className="size-[18px]" />
              </button>
            </div>

            {cartQuantity > 0 && product ? (
              <>
                <div className="flex gap-4 border-b border-[#e7e8e2] py-6">
                  <img
                    src={product.image}
                    alt=""
                    className="size-[94px] rounded-xl bg-[#eeefe9] object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                    <div>
                      <h3 className="truncate text-sm font-medium">
                        {product.title || "Untitled product"}
                      </h3>
                      <p className="mt-1 text-xs text-[#858780]">{price}</p>
                    </div>
                    <div className="flex w-fit items-center gap-3 rounded-full border border-[#e7e8e2] px-2.5 py-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setCartQuantity((quantity) =>
                            Math.max(0, quantity - 1),
                          )
                        }
                        className="text-[#696d64] transition hover:text-[#1e2924]"
                        aria-label="Remove one item"
                      >
                        <Icon name="minus" className="size-3.5" />
                      </button>
                      <span className="min-w-3 text-center text-xs">
                        {cartQuantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setCartQuantity((quantity) => quantity + 1)
                        }
                        className="text-[#696d64] transition hover:text-[#1e2924]"
                        aria-label="Add one item"
                      >
                        <Icon name="plus" className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="mb-5 flex items-center justify-between text-sm">
                    <span className="text-[#777a72]">Subtotal</span>
                    <span className="font-medium">
                      {formatPrice(
                        product.price.amount * cartQuantity,
                        currency,
                      )}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[#1e2924] px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#34483d]"
                    onClick={() => setCartOpen(false)}
                  >
                    Continue shopping
                    <Icon name="arrow" className="size-4" />
                  </button>
                  <p className="mt-4 text-center text-[10px] leading-5 text-[#858780]">
                    Checkout will be available once payment is connected.
                  </p>
                </div>
              </>
            ) : (
              <div className="grid flex-1 place-items-center text-center">
                <div>
                  <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[#eeefe9]">
                    <Icon name="bag" className="size-5 text-[#777a72]" />
                  </span>
                  <p className="font-medium">Your bag is taking a breather.</p>
                  <p className="mt-2 text-sm text-[#858780]">
                    Add a piece you love to get started.
                  </p>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

export default App;
