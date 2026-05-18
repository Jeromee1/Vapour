"use client";

import { useEffect, useState } from "react";
import { fetchCart } from "@/api/cartApi";
import { deleteCartItem } from "@/api/cartApi";
import Swal from "sweetalert2";
import { ToastContainer } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";

export default function CartPage() {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    if (!user) return router.push("/");
    fetchCart().then(setCart).catch(console.error).then(setLoading(false));
  }, [user]);

  const handleClick = async (gameId) => {
    const result = await Swal.fire({
      text: "Are you sure?",
      showCancelButton: true,
      confirmButtonColor: "#d11",
      cancelButtonColor: "gray",
      confirmButtonText: "Remove",
      theme: "dark",
      customClass: {
        popup: "!border-t-2 !border-b-2 !border-purple-500 !bg-gray-900/80 !h-40",
      },
    });

    if (result.isConfirmed) {
      try {
        await deleteCartItem(gameId);

        const updatedCart = await fetchCart();
        setCart(updatedCart);
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.message || "Failed to remove item",
          icon: "error",
        });
      }
    }
  };

  const total = cart
    ? cart?.items?.reduce((sum, item) => {
        return sum + (item.game.onSale ? item.game.price * (1 - item.game.onSale / 100) : item.game.price);
      }, 0)
    : 0;

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="w-full flex justify-center py-10">
      <div className="flex flex-col w-full sm:w-[80vw] xl:w-[60vw]">
        <h2 className="text-3xl">Your Cart</h2>
        <div className="flex flex-col md:flex-row w-full">
          <div className="left md:w-[70%] py-2">
            <div className="w-full gap-y-2 rounded-sm">
              {!cart ? (
                <h2 className="p-6">
                  No items found in cart.
                  <a href="/" className="pl-2 !text-blue-400 underline">
                    Add
                  </a>
                </h2>
              ) : (
                <>
                  {cart?.items?.map((item) => (
                    <div key={item.game._id} className="p-4 flex mb-1" style={{ backgroundColor: "rgb(10,0,50)" }}>
                      <div className="h-[100px] w-[180px]">
                        <img
                          src={
                            item.game.image?.thumbnail
                              ? `${API_URL}/${item.game.image.thumbnail}`
                              : "/placeholderImage.png"
                          }
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-[80%] md:w-[70%] flex justify-between p-2">
                        <a href={`/games/${item.game._id}`} className="!text-white h-[25px] hover:underline">
                          {item.game.title}
                        </a>
                        <div className="flex flex-col justify-between">
                          <div className="flex items-center">
                            {item.game.onSale ? (
                              <>
                                <div className="w-15 h-10 bg-green-800 flex justify-center items-center font-bold !text-green-300">
                                  -{item.game.onSale}%
                                </div>
                                <div className="w-25 h-10 bg-gray-800 flex flex-col justify-center items-center text-sm">
                                  <span className="line-through !text-gray-400 text-xs">RM {item.game.price}</span>
                                  RM {(item.game.price * (1 - item.game.onSale / 100)).toFixed(2)}
                                </div>
                              </>
                            ) : (
                              <div className="w-25 h-10 bg-gray-800 flex flex-col justify-center items-center text-sm rounded-sm">
                                {item.game.price < 1 ? "Free" : `RM ${item.game.price}`}
                              </div>
                            )}
                          </div>
                          <div className="w-full">
                            <h2
                              className="!text-gray-500 underline text-sm cursor-pointer text-center hover:!text-gray-400"
                              onClick={() => handleClick(item.game._id)}
                            >
                              Remove
                            </h2>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          <div className="right md:w-[40%] md:px-4 py-2">
            <div
              className="p-6 flex flex-col justify-between w-full h-[150px] rounded-sm"
              style={{ backgroundColor: "rgb(10,0,50)" }}
            >
              <div className="flex justify-between">
                <h2>Estimated Total</h2>
                <h2>RM {total ? total.toFixed(2) : 0}</h2>
              </div>
              {cart?.items?.length > 0 ? (
                <a
                  href="checkout"
                  className="text-center px-2 py-2 w-full bg-gradient-to-r from-[rgb(40,0,160)] to-[rgb(80,0,320)] hover:from-[rgb(80,0,320)] hover:to-[rgb(40,0,160)] rounded-sm transition duration-1000 ease-in-out transform hover:scale-105 cursor-pointer"
                >
                  Continue to Payment
                </a>
              ) : (
                <div className="text-center px-2 py-2 w-full bg-gradient-to-r from-[rgb(50,50,50)] to-[rgb(100,100,100)] rounded-sm cursor-pointer">
                  Continue to Payment
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
