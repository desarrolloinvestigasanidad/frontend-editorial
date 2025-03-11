"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setMessage("No token provided.");
      return;
    }

    fetch(`http://localhost:5000/api/verify-email?token=${token}`)
      .then((res) => {
        if (!res.ok) throw new Error("Verification failed.");
        return res.json();
      })
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          setMessage("Email verified successfully. Redirecting to profile...");
          setTimeout(() => router.push("/profile"), 2000);
        } else {
          setMessage(data.message || "Verification failed.");
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage("An error occurred during verification.");
      });
  }, [token, router]);

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold'>{message}</h1>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading verification...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
