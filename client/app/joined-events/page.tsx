'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { JoinedEvent } from '../../lib/types';
import AuthGuard from '../../components/AuthGuard';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Tag,
  ArrowRight,
  XCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

function JoinedEventsContent() {
  const [joinedEvents, setJoinedEvents] = useState<JoinedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJoinedEvents = async () => {
    try {
      setLoading(true);
      // Fetches user's joined events sorted by eventDate ascending from server
      const res = await api.joined.getAll();
      if (res.success && res.events) {
        setJoinedEvents(res.events);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load your joined events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJoinedEvents();
  }, []);

  const handleCancelParticipation = async (eventId: string, title: string) => {
    const result = await Swal.fire({
      title: 'Cancel Participation?',
      text: `Are you sure you want to withdraw your volunteer commitment for "${title}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, withdraw',
      cancelButtonText: 'Keep commitment',
      background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a',
    });

    if (result.isConfirmed) {
      try {
        const res = await api.joined.cancel(eventId);
        if (res.success) {
          toast.success('Your participation was canceled.');
          setJoinedEvents((prev) => prev.filter((e) => e.eventId !== eventId && e._id !== eventId));
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to cancel participation.');
      }
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-950/80 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Volunteer Commitments</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Joined Social Events
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Events you have committed to attend, sorted chronologically by scheduled event date.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-md shadow-emerald-600/20 text-sm transition-all shrink-0"
          >
            <span>Explore More Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-44 rounded-2xl bg-slate-200 dark:bg-slate-800 skeleton-shimmer"
              />
            ))}
          </div>
        ) : joinedEvents.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              No joined events yet
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              You haven&apos;t joined any social initiatives yet. Discover upcoming drives in your area and volunteer your time!
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <span>Browse Upcoming Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {joinedEvents.map((joined) => {
              const formattedDate = new Date(joined.eventDate).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              const formattedTime = new Date(joined.eventDate).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={joined._id}
                  className="flex flex-col sm:flex-row bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  {/* Thumbnail */}
                  <div className="sm:w-44 h-44 sm:h-auto shrink-0 bg-slate-900 relative">
                    <img
                      src={joined.thumbnail}
                      alt={joined.eventTitle}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white">
                        {joined.eventType}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div className="space-y-2">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">
                        {joined.eventTitle}
                      </h3>

                      <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {formattedDate} &bull; {formattedTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="truncate">{joined.location}</span>
                        </div>
                      </div>

                      <div className="pt-2 text-[11px] text-slate-400">
                        Joined on {new Date(joined.joinedAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 mt-4">
                      <Link
                        href={`/events/${joined.eventId}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleCancelParticipation(joined.eventId, joined.eventTitle)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Withdraw</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function JoinedEventsPage() {
  return (
    <AuthGuard>
      <JoinedEventsContent />
    </AuthGuard>
  );
}
