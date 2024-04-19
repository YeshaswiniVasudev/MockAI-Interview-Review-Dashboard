// Indicate that this code should run on the client side
"use client";
// Import necessary modules and components
import { useEffect } from "react"; // React's useEffect hook for side effects
import { useRouter } from "next/navigation"; // Next.js's useRouter hook for routing

// Define the main component for the home page
export default function Home() {
  // Get the router object
  const router = useRouter();
  // Use an effect to redirect to the Dashboard page when the component mounts
  useEffect(() => {
    // Use the router to navigate to the Dashboard page
    router.push("/Dashboard");
  }, [router]); // The router object is a dependency of this effect

  // Render a loading message while the redirection is in progress
  return <div>Loading...</div>;
}
