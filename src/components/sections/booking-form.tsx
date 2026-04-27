'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Modal } from '@/components/ui/modal';
import { Service } from '@/types';

export function BookingForm() {
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState({
    client_name: '',
    client_phone: '',
    client_email: '',
    service_id: '',
    service_name: '',
    preferred_date: '',
    preferred_time: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('services').select('*').eq('is_active', true);
      if (data) setServices(data);
    };
    fetchServices();
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.client_name) newErrors.client_name = 'Required';
    if (!form.client_phone) newErrors.client_phone = 'Required';
    if (!form.service_id) newErrors.service_id = 'Required';
    if (!form.preferred_date) newErrors.preferred_date = 'Required';
    if (!form.preferred_time) newErrors.preferred_time = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setForm({
          client_name: '',
          client_phone: '',
          client_email: '',
          service_id: '',
          service_name: '',
          preferred_date: '',
          preferred_time: '',
          notes: '',
        });
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-transparent border-b border-gray-700 focus:border-[#B8860B] outline-none py-3 text-white text-sm font-sans tracking-wide transition-colors duration-300 placeholder:text-gray-600';
  const labelClass = 'text-[10px] uppercase tracking-[0.4em] text-[#B8860B] font-sans mb-1 block';

  return (
    <section id="booking" className="py-32 bg-black">
      <div className="max-w-4xl mx-auto px-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-16 bg-[#B8860B]/50" />
          <p className="text-[#B8860B] uppercase tracking-[0.6em] text-xs font-sans">
            Reserve Your Slot
          </p>
          <div className="h-px w-16 bg-[#B8860B]/50" />
        </div>
        <h2 className="font-display text-5xl md:text-6xl text-white font-light italic text-center mb-20">
          Book an Appointment
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {/* Full Name */}
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              className={inputClass}
              placeholder="Your name"
              value={form.client_name}
              onChange={(e) => setForm({ ...form, client_name: e.target.value })}
            />
            {errors.client_name && <p className="text-red-400 text-xs mt-1">{errors.client_name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className={labelClass}>Phone Number</label>
            <input
              className={inputClass}
              placeholder="+63 XXX XXX XXXX"
              value={form.client_phone}
              onChange={(e) => setForm({ ...form, client_phone: e.target.value })}
            />
            {errors.client_phone && <p className="text-red-400 text-xs mt-1">{errors.client_phone}</p>}
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>Email (Optional)</label>
            <input
              className={inputClass}
              placeholder="your@email.com"
              value={form.client_email}
              onChange={(e) => setForm({ ...form, client_email: e.target.value })}
            />
          </div>

          {/* Service */}
          <div>
            <label className={labelClass}>Service</label>
            <select
              className={`${inputClass} cursor-pointer`}
              value={form.service_id}
              onChange={(e) => {
                const selected = services.find((s) => s.id === e.target.value);
                setForm({ ...form, service_id: e.target.value, service_name: selected?.name || '' });
              }}
            >
              <option value="" className="bg-black">Select a service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id} className="bg-black">
                  {s.name} — {s.price_label}
                </option>
              ))}
            </select>
            {errors.service_id && <p className="text-red-400 text-xs mt-1">{errors.service_id}</p>}
          </div>

          {/* Date */}
          <div>
            <label className={labelClass}>Preferred Date</label>
            <input
              type="date"
              className={inputClass}
              value={form.preferred_date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setForm({ ...form, preferred_date: e.target.value })}
            />
            {errors.preferred_date && <p className="text-red-400 text-xs mt-1">{errors.preferred_date}</p>}
          </div>

          {/* Time */}
          <div>
            <label className={labelClass}>Preferred Time</label>
            <input
              type="time"
              className={inputClass}
              value={form.preferred_time}
              onChange={(e) => setForm({ ...form, preferred_time: e.target.value })}
            />
            {errors.preferred_time && <p className="text-red-400 text-xs mt-1">{errors.preferred_time}</p>}
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className={labelClass}>Notes (Optional)</label>
            <input
              className={inputClass}
              placeholder="Any special requests?"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="relative border border-[#B8860B] text-[#B8860B] px-16 py-4 text-xs uppercase tracking-[0.4em] font-sans overflow-hidden group transition-all duration-500 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="absolute inset-0 bg-[#B8860B] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative z-10">{loading ? 'Submitting...' : 'Book Appointment'}</span>
          </button>
        </div>
      </div>

      <Modal isOpen={success} onClose={() => setSuccess(false)} title="Booking Received!">
        <p className="text-gray-300 text-sm font-sans leading-relaxed">
          Thank you, {form.client_name || 'valued client'}! We will confirm your appointment within 24 hours.
        </p>
      </Modal>
    </section>
  );
}
