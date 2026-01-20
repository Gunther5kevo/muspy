import { FileText, Download, Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function ReportsView() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-serif font-bold mb-2" style={{ color: '#2B0E3F' }}>
          Reports & Analytics
        </h2>
        <p style={{ color: '#6B7280' }}>Generate and download platform reports</p>
      </div>

      {/* Report Types */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Revenue Report */}
        <div className="bg-white rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all" 
             style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
               style={{ background: 'linear-gradient(to right, #059669, #10B981)' }}>
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: '#2B0E3F' }}>Revenue Report</h3>
          <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
            Detailed breakdown of platform revenue and transactions
          </p>
          <button className="w-full px-4 py-2 rounded-lg border-2 font-medium hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                  style={{ borderColor: '#6A0DAD', color: '#6A0DAD' }}>
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>

        {/* User Activity Report */}
        <div className="bg-white rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all" 
             style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
               style={{ background: 'linear-gradient(to right, #6A0DAD, #9D4EDD)' }}>
            <Users className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: '#2B0E3F' }}>User Activity</h3>
          <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
            User engagement and platform usage statistics
          </p>
          <button className="w-full px-4 py-2 rounded-lg border-2 font-medium hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                  style={{ borderColor: '#6A0DAD', color: '#6A0DAD' }}>
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>

        {/* Bookings Report */}
        <div className="bg-white rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all" 
             style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
               style={{ background: 'linear-gradient(to right, #C1A35E, #E5D9B6)' }}>
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: '#2B0E3F' }}>Bookings Report</h3>
          <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
            Complete overview of all bookings and appointments
          </p>
          <button className="w-full px-4 py-2 rounded-lg border-2 font-medium hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                  style={{ borderColor: '#6A0DAD', color: '#6A0DAD' }}>
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>

        {/* Provider Performance */}
        <div className="bg-white rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all" 
             style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
               style={{ background: 'linear-gradient(to right, #2B0E3F, #6A0DAD)' }}>
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: '#2B0E3F' }}>Provider Performance</h3>
          <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
            Ratings, reviews, and performance metrics
          </p>
          <button className="w-full px-4 py-2 rounded-lg border-2 font-medium hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                  style={{ borderColor: '#6A0DAD', color: '#6A0DAD' }}>
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>

        {/* Custom Report */}
        <div className="bg-white rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all" 
             style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
               style={{ background: 'linear-gradient(to right, #6A0DAD, #9D4EDD)' }}>
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: '#2B0E3F' }}>Custom Report</h3>
          <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
            Create a custom report with specific date ranges
          </p>
          <button className="w-full px-4 py-2 rounded-lg border-2 font-medium hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                  style={{ borderColor: '#6A0DAD', color: '#6A0DAD' }}>
            <FileText className="w-4 h-4" />
            Create
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-white rounded-xl p-6 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#2B0E3F' }}>Report Information</h3>
        <div className="space-y-2" style={{ color: '#6B7280' }}>
          <p>• All reports are generated in CSV format for easy analysis</p>
          <p>• Reports include data from the last 30 days by default</p>
          <p>• Custom reports allow you to select specific date ranges</p>
          <p>• Reports are generated in real-time and reflect current data</p>
        </div>
      </div>
    </div>
  );
}