import { useState } from 'react';
import { Search, CheckCircle, Ban, Eye } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';

export default function UsersView() {
  const { users, loading, suspendUser, activateUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-serif font-bold mb-2" style={{ color: '#2B0E3F' }}>
          Users Management
        </h2>
        <p style={{ color: '#6B7280' }}>Manage client accounts</p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
            style={{ borderColor: 'rgba(229, 199, 255, 0.3)' }}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: 'linear-gradient(to right, #F8F5FF, #E5C7FF)' }}>
              <tr>
                <th className="text-left p-4 font-semibold" style={{ color: '#2B0E3F' }}>User</th>
                <th className="text-left p-4 font-semibold" style={{ color: '#2B0E3F' }}>Status</th>
                <th className="text-left p-4 font-semibold" style={{ color: '#2B0E3F' }}>Joined</th>
                <th className="text-right p-4 font-semibold" style={{ color: '#2B0E3F' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center" style={{ color: '#6B7280' }}>
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center" style={{ color: '#6B7280' }}>
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-purple-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                             style={{ background: 'linear-gradient(to right, #2B0E3F, #6A0DAD)' }}>
                          {user.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: '#2B0E3F' }}>{user.full_name}</p>
                          <p className="text-sm" style={{ color: '#6B7280' }}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {user.is_active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-sm" style={{ color: '#6B7280' }}>
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {user.is_active ? (
                          <button
                            onClick={() => suspendUser(user.id)}
                            className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                            title="Suspend"
                          >
                            <Ban className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => activateUser(user.id)}
                            className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
                            title="Activate"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button className="p-2 rounded-lg hover:bg-purple-100 transition-colors" style={{ color: '#6A0DAD' }}>
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}