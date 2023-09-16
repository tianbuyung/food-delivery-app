"use client";

import RestaurantList from "@/components/RestaurantList";
import Search from "@/components/Search";
import { useState } from "react";

export const dynamic = "force-dynamic";

export default function Home() {
  const [query, setQuery] = useState("");

  return (
    <main className="mx-auto container m-6">
      <div className="mb-6">
        <Search setQuery={setQuery} />
      </div>
      <RestaurantList query={query} />
    </main>
  );
}
