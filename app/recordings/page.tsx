"use client";
import React, { useEffect, useState } from 'react';
import { DataTable } from "@/components/data-table";
import { recording, columns } from "./columns";
import styles from './Page.module.css'; // Import the CSS module
import Head from 'next/head';
export default function Page() {
  const [recordings, setRecordings] = useState<recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetch('/api/recordingsData/')
        .then(response => response.json())
        .then(data => {
          setRecordings(data);
          setIsLoading(false);
        });
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      
      <section className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
      </header>
      <div className={styles.content}>
        <DataTable columns={columns} data={recordings} />
      </div>
    </section>
  
    </>
  
  );
}