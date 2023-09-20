/* pages/login.js */
"use client";

import { FormEvent, useState } from "react";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";

import Form from "@/components/Form";

export default function LoginRoute() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    const { email, password } = formData;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/local`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      Cookie.set("token", data.jwt);

      router.push("/");
    } catch (error: any) {
      setError(error);
    }
  };

  return (
    <Form
      title="Login"
      buttonText="Login"
      formData={formData}
      setFormData={setFormData}
      callback={handleLogin}
      error={error}
    />
  );
}
