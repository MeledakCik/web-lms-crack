'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/home'); // Arahkan ke halaman login
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting to Login...</p>
    </div>
  );
};

export default Home;

