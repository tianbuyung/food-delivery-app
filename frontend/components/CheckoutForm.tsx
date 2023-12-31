"use client";

import React, { ChangeEvent, useState } from "react";
import Cookie from "js-cookie";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";

import { useInitialRender } from "@/utils/useInitialRender";
import { useCartContext } from "@/contexts/CartProvider";
import { useUserContext } from "@/contexts/UserProvider";

const options = {
  style: {
    base: {
      fontSize: "32px",
      color: "#52a635",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2521",
    },
  },
};

interface AddressInfo {
  address: string;
  city: string;
  state: string;
  error: { message?: string } | null;
  [key: string]: string | { message?: string } | null | undefined;
}

const INITIAL_STATE: AddressInfo = {
  address: "",
  city: "",
  state: "",
  error: null,
};

export default function CheckoutForm() {
  const [data, setData] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const { user } = useUserContext();
  const { cart, resetCart, setShowCart } = useCartContext();

  const initialRender = useInitialRender();

  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  if (!initialRender) return null;

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const updateItem = (data[e.target.name] = e.target.value);
    setData({ ...data, updateItem });
  }

  async function submitOrder(e: any) {
    e.preventDefault();
    const cardElement = elements?.getElement(CardElement);
    const token = cardElement && (await stripe?.createToken(cardElement));

    if (data.address === "") {
      setData({ ...data, error: { message: "Address is required" } });
      return;
    }

    if (data.city === "") {
      setData({ ...data, error: { message: "City is required" } });
      return;
    }

    if (data.state === "") {
      setData({ ...data, error: { message: "State is required" } });
      return;
    }

    if (token?.error) {
      setData({ ...data, error: { message: token.error.message } });
      return;
    }

    const jwt = Cookie.get("token");

    try {
      setLoading(true);
      // fetch the order
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: {
            amount: cart.total,
            dishes: cart.items,
            address: data.address,
            city: data.city,
            state: data.state,
            token: token?.token.id,
          },
        }),
      });

      const result = await res.json();

      if (result.token) {
        alert("Transaction Successful, continue your shopping");
        setData(INITIAL_STATE);
        resetCart();
        setShowCart(true);
        router.push("/");
      }
    } catch (error: any) {
      setData({ ...data, error: { message: error.message } });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form>
      <div className="bg-white shadow-md rounded-lg p-8">
        <h5 className="text-lg font-semibold">Your information:</h5>
        <hr className="my-4" />
        <div className="flex mb-6">
          <div className="flex-1">
            <label
              className="block mb-2 test-gray-800 font-medium"
              htmlFor="address"
            >
              Address
            </label>
            <input
              id="address"
              className="appearance-none block w-full p-3 leading-5 text-gray-900 border border-gray-200 rounded-lg shadow-md placeholder-text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              type="text"
              name="address"
              onChange={onChange}
              placeholder="Enter your address"
            />
          </div>
        </div>
        <div className="flex mb-6">
          <div className="flex-1 mr-6">
            <label
              htmlFor="city"
              className="block mb-2 test-gray-800 font-medium"
            >
              City
            </label>
            <input
              type="text"
              name="city"
              id="city"
              onChange={onChange}
              className="appearance-none block w-full p-3 leading-5 text-gray-900 border border-gray-200 rounded-lg shadow-md placeholder-text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            />
          </div>

          <div className="w-1/4">
            <label
              htmlFor="state"
              className="block mb-2 test-gray-800 font-medium"
            >
              State
            </label>
            <input
              type="text"
              name="state"
              id="state"
              onChange={onChange}
              className="appearance-none block w-full p-3 leading-5 text-gray-900 border border-gray-200 rounded-lg shadow-md placeholder-text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            />
          </div>
        </div>
        {cart.items.length > 0 ? (
          <div className="p-6">
            <div>Credit or debit card</div>
            <div className="my-4">
              <CardElement options={options} />
            </div>
            <button
              className="inline-block w-full px-6 py-3 text-center font-bold text-white bg-green-500 hover:bg-green-600 transition duration-200 rounded-full"
              onClick={(e) => (user ? submitOrder(e) : router.push("/login"))}
              disabled={loading}
            >
              {loading ? "Submitting" : "Submit Order"}
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Your cart is empty</h1>
            <p className="text-gray-500">
              Add some items to your cart to continue
            </p>
          </div>
        )}
        <div>
          {data.error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <strong className="font-bold">Error!</strong>{" "}
              <span className="block sm:inline">{data.error.message}</span>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
