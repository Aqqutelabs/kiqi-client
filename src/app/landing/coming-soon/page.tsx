"use client";
import NavBar from "@/components/landing/navbar";
import { Button } from "@/components/ui/Button";
import { Rocket } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ComingSoonLanding() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with your actual API endpoint
      // const response = await fetch('/api/waitlist', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Thanks! We'll notify you when we launch!");
      setEmail("");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      className="bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark"
      style={{ minHeight: "max(884px, 100dvh)" }}>
        <NavBar/>
      <div className="relative flex h-auto min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden p-4">
        <div className="flex max-w-md flex-col items-center text-center">
          
          {/* Logo */}
          <div className="mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-500 text-white shadow-lg">
              <Rocket/>
            </div>
          </div>
          
          {/* Headline */}
          <h1 className="text-text-light dark:text-text-dark tracking-tight text-[40px] font-bold leading-tight pb-3">
            Coming Soon
          </h1>
          
          {/* Description */}
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-normal leading-relaxed pb-8 max-w-sm">
            The best way to manage your tasks. Get ready for a revolutionary new experience. 
            Be the first to know when we launch.
          </p>
          
        </div>
        <Button variant={"tertiary"} onClick={() => redirect("/")}>Back to Home</Button>
      </div>
    </section>
  );
}