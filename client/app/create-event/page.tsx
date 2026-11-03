'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import AuthGuard from '../../components/AuthGuard';
import toast from 'react-hot-toast';
import {
  PlusCircle,
  Calendar,
  MapPin,
  Tag,
  Image as ImageIcon,
  AlignLeft,
  Type,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

const eventTypes = [
  'Donation',
  'Cleanup',
  'Plantation',
  'Food Rescue',
  'Healthcare',
  'Education',
  'Relief',
  'Other',
];

function CreateEventForm() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('Donation');
  const [thumbnail, setThumbnail] = useState('');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Compute minimum selectable date (strictly tomorrow or today + 1 hour)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !location.trim() || !eventDate) {
      toast.error('Please fill in all mandatory fields.');
      return;
    }

    // Strict future date validation
    const selectedDate = new Date(eventDate);
    const now = new Date();
    if (isNaN(selectedDate.getTime()) || selectedDate.getTime() <= now.getTime()) {
      toast.error('Event date must be strictly in the future. Past dates are not allowed.');
      return;
    }

    const finalThumbnail =
      thumbnail.trim() ||
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80';

    try {
      setSubmitting(true);
      const res = await api.events.create({
        title: title.trim(),
        description: description.trim(),
        eventType,
        thumbnail: finalThumbnail,
        location: location.trim(),
        eventDate: selectedDate.toISOString(),
      });

      if (res.success) {
        toast.success(res.message || 'Social development event published successfully!');
        // Requirement: Redirect user to Upcoming Events page
        router.push('/events');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to publish event.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/30">
            <PlusCircle className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Host a Community Initiative
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Mobilize local volunteers in your municipality. All dates must be in the future to ensure effective planning.
          </p>
        </div>

        {/* Create Form Container */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Event Title *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Type className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Winter Clothes Distribution – Mirpur 10, Dhaka"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Event Type & Event Date (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Event Type Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Event Type *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Tag className="w-5 h-5" />
                  </div>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Event Date (Strict Future Date) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Event Date & Time (Future Only) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <input
                    type="datetime-local"
                    min={getMinDateTime()}
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Location & Meeting Spot *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Mirpur 10 Community Center, Dhaka"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Thumbnail URL */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Thumbnail Image URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <input
                  type="url"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Optional: Leave empty for a professional default event photograph.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Event Description & Logistics *
              </label>
              <div className="relative">
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the cause, what supplies will be distributed or collected, what volunteers should bring, and guidelines..."
                  required
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />
              </div>
            </div>

            {/* User Details Notice */}
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                Logged in as <strong>{user?.name}</strong> ({user?.email}). You will be saved as the verified organizer of this initiative.
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-lg shadow-emerald-600/30 transition-all text-sm disabled:opacity-50"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{submitting ? 'Publishing Event...' : 'Publish Social Event'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CreateEventPage() {
  return (
    <AuthGuard>
      <CreateEventForm />
    </AuthGuard>
  );
}
