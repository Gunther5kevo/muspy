import { RefreshCw } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center" 
      style={{ background: 'linear-gradient(to bottom right, #F8F5FF, #FFFFFF, #E5C7FF)' }}
    >
      <div className="text-center">
        <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#6A0DAD' }} />
        <p className="text-lg font-medium" style={{ color: '#2B0E3F' }}>Loading dashboard...</p>
      </div>
    </div>
  );
}