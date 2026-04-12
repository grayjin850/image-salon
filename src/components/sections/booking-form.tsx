'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
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
    if (!form.client_name) newErrors.client_name = 'Name is required';
    if (!form.client_phone) newErrors.client_phone = 'Phone is required';
    if (!form.service_id) newErrors.service_id = 'Service is required';
    if (!form.preferred_date) newErrors.preferred_date = 'Date is required';
    else if (new Date(form.preferred_date) < new Date()) newErrors.preferred_date = 'Date must be in the future';
    if (!form.preferred_time) newErrors.preferred_time = 'Time is required';
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
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const serviceOptions = services.map((s) => ({
    label: `${s.name} — ${s.price_label}`,
    value: s.id,
  }));

  return (
    <section id="booking" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-2xl mx-auto px-6">
        <p className="text-[#B8860B] uppercase tracking-[0.5em] text-xs text-center mb-4">
          Reserve Your Slot
        </p>
        <h2 className="font-heading text-4xl md:text-5xl text-white text-center mb-16">
          Book an Appointment
        </h2>

        <div className="space-y-6">
          <Input
            label="Full Name"
            placeholder="Your name"
            value={form.client_name}
            onChange={(e) => setForm({ ...form, client_name: e.target.value })}
            error={errors.client_name}
          />
          <Input
            label="Phone Number"
            placeholder="+63 XXX XXX XXXX"
            value={form.client_phone}
            onChange={(e) => setForm({ ...form, client_phone: e.target.value })}
            error={errors.client_phone}
          />
          <Input
            label="Email (optional)"
            placeholder="your@email.com"
            value={form.client_email}
            onChange={(e) => setForm({ ...form, client_email: e.target.value })}
          />
          <Select
            label="Service"
            options={serviceOptions}
            value={form.service_id}
            onChange={(e) => {
              const selected = services.find((s) => s.id === e.target.value);
              setForm({ ...form, service_id: e.target.value, service_name: selected?.name || '' });
            }}
            error={errors.service_id}
          />
          <Input
            label="Preferred Date"
            type="date"
            value={form.preferred_date}
            onChange={(e) => setForm({ ...form, preferred_date: e.target.value })}
            error={errors.preferred_date}
          />
          <Input
            label="Preferred Time"
            type="time"
            value={form.preferred_time}
            onChange={(e) => setForm({ ...form, preferred_time: e.target.value })}
            error={errors.preferred_time}
          />
          <Input
            label="Notes (optional)"
            placeholder="Any special requests?"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <Button size="lg" onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? 'Submitting...' : 'Book Appointment'}
          </Button>
        </div>
      </div>

      <Modal isOpen={success} onClose={() => setSuccess(false)} title="Booking Received!">
        <p className="text-gray-300 text-sm">
          Thank you! We will confirm your appointment within 24 hours.
        </p>
      </Modal>
    </section>
  );
}