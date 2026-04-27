'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Booking, BookingStatus } from '@/types';

interface BookingsTableProps {
  bookings: Booking[];
}

export function BookingsTable({ bookings }: BookingsTableProps) {
  const [data, setData] = useState(bookings);

  const updateStatus = async (id: string, status: BookingStatus) => {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setData(data.map((b) => (b.id === id ? { ...b, status } : b)));
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#B8860B]/20">
            <th className="text-left py-3 px-4 text-xs uppercase tracking-widest text-[#B8860B]">Name</th>
            <th className="text-left py-3 px-4 text-xs uppercase tracking-widest text-[#B8860B]">Phone</th>
            <th className="text-left py-3 px-4 text-xs uppercase tracking-widest text-[#B8860B]">Service</th>
            <th className="text-left py-3 px-4 text-xs uppercase tracking-widest text-[#B8860B]">Date</th>
            <th className="text-left py-3 px-4 text-xs uppercase tracking-widest text-[#B8860B]">Time</th>
            <th className="text-left py-3 px-4 text-xs uppercase tracking-widest text-[#B8860B]">Status</th>
            <th className="text-left py-3 px-4 text-xs uppercase tracking-widest text-[#B8860B]">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((booking) => (
            <tr key={booking.id} className="border-b border-gray-800 hover:bg-white/5">
              <td className="py-3 px-4 text-gray-300">{booking.client_name}</td>
              <td className="py-3 px-4 text-gray-300">{booking.client_phone}</td>
              <td className="py-3 px-4 text-gray-300">{booking.service_name}</td>
              <td className="py-3 px-4 text-gray-300">{booking.preferred_date}</td>
              <td className="py-3 px-4 text-gray-300">{booking.preferred_time}</td>
              <td className="py-3 px-4"><Badge status={booking.status} /></td>
              <td className="py-3 px-4">
                <select
                  className="bg-black text-white border border-gray-600 px-2 py-1 text-xs"
                  value={booking.status}
                  onChange={(e) => updateStatus(booking.id, e.target.value as BookingStatus)}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}