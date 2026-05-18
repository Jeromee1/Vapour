"use client";

import { useEffect, useState } from "react";
import { fetchCart } from "@/api/cartApi";
import CheckoutButton from "@/components/CheckoutButton";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { cartCheckout } from "@/api/cartApi";
import { toast } from "react-toastify";

export default function Checkout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [cart, setCart] = useState(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/");
    } else {
      fetchCart().then(setCart).catch(console.error);
    }
  }, [loading, user]);

  const total = cart
    ? cart.items.reduce((sum, item) => {
        return sum + (item.game.onSale ? item.game.price * (1 - item.game.onSale / 100) : item.game.price);
      }, 0)
    : 0;

  const initialOptions = {
    "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    currency: "MYR",
    intent: "capture",
  };

  const handleFree = async () => {
    let res = await cartCheckout();
    if (res) {
      await fetchCart();
      toast(`Checkout complete`, {
        theme: "dark",
        position: "bottom-right",
        autoClose: 2000,
      });
      router.push("/checkout/thankyou");
    }
  };

  if (loading || !user) {
    return <Spinner />;
  }

  return (
    <div className="w-full flex justify-center py-10">
      <div className="flex flex-col w-full sm:w-[80vw] xl:w-[60vw]">
        <h2 className="text-3xl">Checkout</h2>
        <div className="flex flex-col md:flex-row w-full">
          <div className="left md:w-[70%] py-2">
            <div className="w-full p-6 rounded-sm" style={{ backgroundColor: "rgb(10,0,50)" }}>
              <div className="flex flex-col gap-2">
                {cart?.items.map((item) => (
                  <div key={item.game._id} className="flex justify-between">
                    <h2 className="!text-white">{item.game.title}</h2>
                    {item.game.onSale != 0 ? (
                      <div className="flex items-center gap-4">
                        <h2 className="!text-gray-400 line-through text-xs">RM {item.game.price}</h2>
                        <h2>RM {(item.game.price * (1 - item.game.onSale / 100)).toFixed(2)}</h2>
                      </div>
                    ) : (
                      <h2>{item.game.price < 1 ? "Free" : `RM ${item.game.price}`}</h2>
                    )}
                  </div>
                ))}
                <hr className="my-4 opacity-50" />
                <div className="flex justify-between font-bold">
                  <h2>Total</h2>
                  <h2>RM {total.toFixed(2)}</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="right md:w-[40%] md:px-4 py-2">
            <div
              className="p-6 flex flex-col justify-between w-full h-full rounded-sm"
              style={{ backgroundColor: "rgb(10,0,50)" }}
            >
              <h2 className="mb-4">Payment Options</h2>
              <PayPalScriptProvider options={initialOptions}>
                <CheckoutButton total={total} />
              </PayPalScriptProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
