// src/components/ClientOnlyToaster.tsx
'use client';

import dynamic from 'next/dynamic';

// Dynamically import Toaster with SSR disabled
const DynamicToaster = dynamic(() =>
  import('@/components/ui/toaster').then(mod => mod.Toaster),
  {
    ssr: false,
    loading: () => null, // Optional: you can provide a loading skeleton or null
  }
);

export function ClientOnlyToaster() {
  return <DynamicToaster />;
}
