'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/Dashboard');
  }, [router]);  // Adding router to the dependency array ensures this runs once the router is available

  return (
    <div>Loading...</div>  // Display a loading message or a spinner while waiting for the navigation
  );
}
