import { MessageSquare, AlertCircle } from 'lucide-react';

export default function DisputesView() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-serif font-bold mb-2" style={{ color: '#2B0E3F' }}>
          Disputes Management
        </h2>
        <p style={{ color: '#6B7280' }}>Handle user disputes and conflicts</p>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-xl p-12 text-center shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" 
             style={{ background: 'linear-gradient(to right, #6A0DAD, #9D4EDD)' }}>
          <MessageSquare className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-3" style={{ color: '#2B0E3F' }}>
          No Active Disputes
        </h3>
        <p className="text-lg mb-6" style={{ color: '#6B7280' }}>
          Great news! There are currently no disputes requiring your attention.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-600">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">System running smoothly</span>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-xl p-6 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#2B0E3F' }}>
          Dispute Resolution Process
        </h3>
        <ul className="space-y-2" style={{ color: '#6B7280' }}>
          <li className="flex items-start gap-2">
            <span className="font-bold" style={{ color: '#6A0DAD' }}>1.</span>
            Review both parties' claims and evidence
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold" style={{ color: '#6A0DAD' }}>2.</span>
            Contact involved parties for additional information if needed
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold" style={{ color: '#6A0DAD' }}>3.</span>
            Make a fair decision based on platform policies
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold" style={{ color: '#6A0DAD' }}>4.</span>
            Document the resolution and notify all parties
          </li>
        </ul>
      </div>
    </div>
  );
}