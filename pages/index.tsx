import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <div className="mb-4 inline-block animate-spin rounded-full border-4 border-blue-600 border-t-transparent h-12 w-12"></div>
        <p className="text-gray-700 dark:text-gray-300">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}