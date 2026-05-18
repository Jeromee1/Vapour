"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { fetchCart, cartCheckout } from "@/api/cartApi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CheckoutButton({ total }) {
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

  const router = useRouter();

  const onCurrencyChange = ({ target: { value } }) => {
    setCurrency(value);
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: USD,
      },
    });
  };

  const onCreateOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: { value: total.toFixed(2) },
        },
      ],
    });
  };

  const onApproveOrder = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      const name = details.payer.name.given_name;

      let res = await cartCheckout();
      if (res) {
        await fetchCart();
        toast(`Completed transaction by ${name}`, {
          theme: "dark",
          position: "bottom-right",
          autoClose: 2000,
        });
        router.push("/checkout/thankyou");
      }
    });
  };

  return (
    <div className="checkout">
      {isPending ? (
        <h2>Loading...</h2>
      ) : (
        <>
          <PayPalButtons style={{ layout: "vertical" }} createOrder={onCreateOrder} onApprove={onApproveOrder} />
        </>
      )}
    </div>
  );
}
