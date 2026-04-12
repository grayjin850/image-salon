import emailjs from '@emailjs/browser';

export const sendBookingConfirmation = async (data: {
  client_name: string;
  client_phone: string;
  service_name: string;
  preferred_date: string;
  preferred_time: string;
}) => {
  try {
    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      {
        client_name: data.client_name,
        client_phone: data.client_phone,
        service_name: data.service_name,
        preferred_date: data.preferred_date,
        preferred_time: data.preferred_time,
      },
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
    );
  } catch (err) {
    console.error('EmailJS error:', err);
  }
};