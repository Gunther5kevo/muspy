import { Suspense } from 'react';
import VerifyEmailContent from '@/components/VerifyEmailContent';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailFallback() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      style={{
        background: "linear-gradient(to bottom right, #F8F5FF, #FFFFFF, #E5C7FF)",
      }}
    >
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 border text-center"
          style={{ borderColor: "rgba(229, 199, 255, 0.3)" }}
        >
          <div className="animate-pulse">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full mx-auto mb-4 sm:mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}