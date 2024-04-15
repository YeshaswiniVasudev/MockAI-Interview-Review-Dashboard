"use client";
import React, { useEffect, useState } from 'react';
import { DataTable } from "@/components/data-table";
import { recording, columns } from "./columns";

export default function Page() {
  const [recordings, setRecordings] = useState<recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only fetch the data if the component is being rendered on the client side
    if (typeof window !== 'undefined') {
      fetch('/api/recordingsData/')
        .then(response => response.json())
        .then(data => {
          setRecordings(data);
          setIsLoading(false); // Set loading to false after data is fetched
        });
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Show loading message if data is still being fetched
  }

  return (
    <section className="py-24">
      <div className="container">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <DataTable columns={columns} data={recordings} />
      </div>
    </section>
  );
}
