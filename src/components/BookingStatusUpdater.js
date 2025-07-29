"use client";
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function BookingStatusUpdater() {
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'bookings') {
        toast.success('Booking status updated!');
        // You can add logic to refresh data here
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return null;
}