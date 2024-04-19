// Import necessary modules and components
"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { recording, columns } from "./columns";
import styles from "./Page.module.css";

// Define the main component for the page
export default function Page() {
  // Define state variables for the recordings and the loading state
  const [recordings, setRecordings] = useState<recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use an effect to fetch the recordings data when the component mounts
  useEffect(() => {
    // Check if window is defined to prevent issues with server-side rendering
    if (typeof window !== "undefined") {
      // Fetch the recordings data from the API
      fetch("/api/recordingsData/")
        .then((response) => response.json())
        .then((data) => {
          // Update the recordings state with the fetched data
          setRecordings(data);
          // Update the loading state to indicate that the data has been loaded
          setIsLoading(false);
        });
    }
  }, []); // The empty array as a dependency means this effect runs once on mount

  // Render a loading message if the data is still loading
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render the main content of the page
  return (
    <>
      <section className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Dashboard</h1>
        </header>
        <div className={styles.content}>
          {/* Render the DataTable component with the columns and data */}
          <DataTable columns={columns} data={recordings} />
        </div>
      </section>
    </>
  );
}
