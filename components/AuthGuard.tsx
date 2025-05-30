"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, refreshUser } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsVerifying(true);
      await refreshUser();
      setIsVerifying(false);
    };

    checkAuth();
  }, [pathname]);

  useEffect(() => {
    if (!isVerifying && !user) {
      router.replace("/login");
    }
  }, [isVerifying, user, router]);

  if (isVerifying) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Loader2 className='w-6 h-6 animate-spin text-purple-600' />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
