/* pages/register.js */
"use client";

import { useState, FormEvent } from "react";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";

import Form from "@/components/Form";
import { useUserContext } from "@/contexts/UserProvider";

export default function RegisterRoute() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useUserContext();

  const registerHandler = async (e: FormEvent) => {
    e.preventDefault();

    const { username, email, password } = formData;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/local/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
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
      setUser(data.user);

      router.push("/");
    } catch (error: any) {
      setError(error);
    }
  };

  return (
    <Form
      title="Sign Up"
      buttonText="Sign Up"
      formData={formData}
      setFormData={setFormData}
      callback={registerHandler}
      error={error}
    />
  );
}
