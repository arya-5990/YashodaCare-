import { useEffect } from 'react';

export default function BlockedBanner() {
  // Lock body scroll when the blocked banner is mounted
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white text-black font-sans p-6 text-center">
      <div className="max-w-xl">
        <p className="text-xl sm:text-2xl font-medium leading-relaxed text-slate-900 whitespace-pre-line">
          Please clear the remaining Firebase Bill Due on 4 June 2026
          {"\n"}
          of amount Rs.₹2,329.18
        </p>
      </div>
    </div>
  );
}
