'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Trash2, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AvailabilityPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSlot, setNewSlot] = useState({ startTime: '09:00', endTime: '10:00' });
  const [loading, setLoading] = useState(false);
  const [providerId] = useState('sample-provider-id'); // Replace with actual provider ID

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Load availability for selected date
  useEffect(() => {
    loadAvailability();
  }, [selectedDate]);

  const loadAvailability = async () => {
    // Simulated data - replace with actual Supabase query
    const mockData = [
      { id: '1', time_slot_start: '09:00:00', time_slot_end: '10:00:00', is_booked: false },
      { id: '2', time_slot_start: '10:00:00', time_slot_end: '11:00:00', is_booked: true },
      { id: '3', time_slot_start: '14:00:00', time_slot_end: '15:00:00', is_booked: false },
    ];
    setAvailability(mockData);
  };

  const addTimeSlot = async () => {
    if (!newSlot.startTime || !newSlot.endTime) return;
    
    setLoading(true);
    try {
      // Simulated insert - replace with actual Supabase insert
      const newAvailability = {
        id: Date.now().toString(),
        time_slot_start: newSlot.startTime + ':00',
        time_slot_end: newSlot.endTime + ':00',
        is_booked: false
      };
      
      setAvailability([...availability, newAvailability]);
      setShowAddModal(false);
      setNewSlot({ startTime: '09:00', endTime: '10:00' });
    } catch (error) {
      console.error('Error adding slot:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTimeSlot = async (slotId) => {
    setLoading(true);
    try {
      // Simulated delete - replace with actual Supabase delete
      setAvailability(availability.filter(slot => slot.id !== slotId));
    } catch (error) {
      console.error('Error deleting slot:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const changeMonth = (delta) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + delta, 1));
  };

  return (
    <div className="min-h-screen p-4 md:p-8 pb-24" style={{ backgroundColor: '#FDF8FF' }}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8" style={{ color: '#2B0E3F' }}>
          Availability Calendar
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-semibold" style={{ color: '#2B0E3F' }}>
                {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </h2>
              <div className="flex gap-1">
                <button
                  onClick={() => changeMonth(-1)}
                  className="p-2 rounded-lg hover:bg-purple-50 active:bg-purple-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  style={{ color: '#8B5CF6' }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => changeMonth(1)}
                  className="p-2 rounded-lg hover:bg-purple-50 active:bg-purple-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  style={{ color: '#8B5CF6' }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center text-xs md:text-sm font-medium py-2" style={{ color: '#6B7280' }}>
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{day.charAt(0)}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {calendarDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => day && setSelectedDate(new Date(day))}
                  disabled={!day}
                  className={`aspect-square rounded-lg p-1 md:p-2 text-xs md:text-sm transition-all active:scale-95 min-h-[44px] flex items-center justify-center ${
                    !day ? 'invisible' : 
                    isSameDay(day, selectedDate) ? 'font-bold text-white shadow-md' :
                    isToday(day) ? 'border-2 font-semibold' :
                    'hover:bg-purple-50 active:bg-purple-100'
                  }`}
                  style={
                    day && isSameDay(day, selectedDate) ? { backgroundColor: '#8B5CF6' } :
                    day && isToday(day) ? { borderColor: '#8B5CF6', color: '#8B5CF6' } :
                    day ? { color: '#374151' } : {}
                  }
                >
                  {day?.getDate()}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots Section */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-semibold" style={{ color: '#2B0E3F' }}>
                <span className="hidden sm:inline">
                  {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className="sm:hidden">
                  {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-lg text-white text-sm transition-all hover:opacity-90 active:scale-95 min-h-[44px]"
                style={{ backgroundColor: '#8B5CF6' }}
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Add Slot</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>

            <div className="space-y-2 md:space-y-3 max-h-96 overflow-y-auto">
              {availability.length === 0 ? (
                <div className="text-center py-8 md:py-12 text-gray-500">
                  <Clock size={40} className="md:w-12 md:h-12 mx-auto mb-2 opacity-20" />
                  <p className="text-sm md:text-base">No availability set</p>
                </div>
              ) : (
                availability.map(slot => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                    style={{ 
                      borderColor: slot.is_booked ? '#FCA5A5' : '#E5C7FF',
                      backgroundColor: slot.is_booked ? '#FEF2F2' : '#F9F5FF'
                    }}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Clock size={14} className="md:w-4 md:h-4 flex-shrink-0" style={{ color: slot.is_booked ? '#EF4444' : '#8B5CF6' }} />
                      <span className="font-medium text-xs md:text-sm truncate" style={{ color: '#2B0E3F' }}>
                        {formatTime(slot.time_slot_start)} - {formatTime(slot.time_slot_end)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {slot.is_booked ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 whitespace-nowrap">
                          Booked
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 whitespace-nowrap">
                          Available
                        </span>
                      )}
                      {!slot.is_booked && (
                        <button
                          onClick={() => deleteTimeSlot(slot.id)}
                          className="p-2 hover:bg-red-100 active:bg-red-200 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                          disabled={loading}
                        >
                          <Trash2 size={14} style={{ color: '#EF4444' }} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Time Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg md:text-xl font-semibold mb-4" style={{ color: '#2B0E3F' }}>
              Add Time Slot
            </h3>
            
            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#6B7280' }}>
                  Start Time
                </label>
                <input
                  type="time"
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                  className="w-full px-3 md:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm md:text-base min-h-[44px]"
                  style={{ borderColor: '#E5C7FF' }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#6B7280' }}>
                  End Time
                </label>
                <input
                  type="time"
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                  className="w-full px-3 md:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm md:text-base min-h-[44px]"
                  style={{ borderColor: '#E5C7FF' }}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 border rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm md:text-base min-h-[44px]"
                style={{ borderColor: '#E5C7FF', color: '#6B7280' }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={addTimeSlot}
                className="flex-1 px-4 py-3 rounded-lg text-white transition-all hover:opacity-90 active:scale-95 text-sm md:text-base min-h-[44px]"
                style={{ backgroundColor: '#8B5CF6' }}
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Slot'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}