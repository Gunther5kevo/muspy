export default function StatCard({ icon: Icon, label, value, change, color }) {
  return (
    <div 
      className="bg-white rounded-xl p-6 shadow-lg border transition-transform hover:scale-105" 
      style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center" 
          style={{ background: color }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <span className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold mb-1" style={{ color: '#2B0E3F' }}>{value}</div>
      <div className="text-sm" style={{ color: '#6B7280' }}>{label}</div>
    </div>
  );
}