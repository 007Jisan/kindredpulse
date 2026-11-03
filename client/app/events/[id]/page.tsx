'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { EventItem, Participant } from '../../../lib/types';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  Users2,
  HeartHandshake,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Sparkles,
  UserCheck,
  Check,
} from 'lucide-react';
import Link from 'next/link';

// New X Logo SVG for event sharing
function XLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params?.id as string;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [hasJoined, setHasJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    async function loadEventData() {
      if (!id) return;
      try {
        setLoading(true);
        const res = await api.events.getById(id);
        if (res.success && res.event) {
          setEvent(res.event);
          setParticipants(res.participants || []);
          setParticipantCount(res.participantCount || 0);
          setHasJoined(res.hasJoined || false);
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to load event details.');
      } finally {
        setLoading(false);
      }
    }

    loadEventData();
  }, [id]);

  const handleJoinEvent = async () => {
    // If not logged in, redirect to login
    if (!user) {
      toast.error('Please log in to join this social initiative.');
      router.push(`/login?redirect=/events/${id}`);
      return;
    }

    if (hasJoined) {
      toast('You are already registered for this event.', { icon: 'ℹ️' });
      return;
    }

    try {
      setJoining(true);
      const res = await api.joined.join(id);
      if (res.success) {
        setHasJoined(true);
        setParticipantCount((prev) => prev + 1);
        setParticipants((prev) => [
          {
            userEmail: user.email,
            userName: user.name,
            userPhoto: user.photoURL,
            joinedAt: new Date().toISOString(),
          },
          ...prev,
        ]);
        toast.success(res.message || 'Successfully joined the event! See you there.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Unable to join event.');
    } finally {
      setJoining(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Event link copied to clipboard!');
    }
  };

  const handleShareToX = () => {
    if (typeof window !== 'undefined' && event) {
      const text = encodeURIComponent(`Join this social service event on KindredPulse: "${event.title}"`);
      const url = encodeURIComponent(window.location.href);
      window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-8 animate-pulse">
        <div className="w-32 h-6 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="w-full h-80 rounded-3xl bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-4">
          <div className="w-3/4 h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="w-1/2 h-5 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Event Not Found
        </h2>
        <p className="text-slate-500 mt-2">
          The event you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/events"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Upcoming Events</span>
        </Link>
      </div>
    );
  }

  const isOrganizer = user && user.email.toLowerCase() === event.organizerEmail.toLowerCase();
  const eventDateObj = new Date(event.eventDate);
  const formattedDate = eventDateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = eventDateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Back navigation */}
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>

        {/* Hero Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          {/* Large Thumbnail Banner */}
          <div className="relative w-full h-80 sm:h-96 overflow-hidden bg-slate-900">
            <img
              src={event.thumbnail}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute top-6 left-6">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-lg backdrop-blur-md">
                <Tag className="w-3.5 h-3.5" />
                {event.eventType}
              </span>
            </div>
          </div>

          {/* Details Content Container */}
          <div className="p-8 sm:p-10 space-y-8">
            {/* Header info */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                {event.title}
              </h1>

              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300 pt-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold">{formattedTime}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span className="font-semibold">{event.location}</span>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Initiative Overview & Mission
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Organizer Box */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={
                    event.organizerPhoto ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                  }
                  alt={event.organizerName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Organized By
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">
                    {event.organizerName}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {event.organizerEmail}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Join Event */}
              <div className="flex items-center gap-3">
                {isOrganizer ? (
                  <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm font-bold">
                    <UserCheck className="w-4 h-4 text-emerald-500" />
                    <span>You Organized This Event</span>
                  </div>
                ) : hasJoined ? (
                  <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-sm font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>You&apos;re Attending!</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleJoinEvent}
                    disabled={joining}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-lg shadow-emerald-600/30 transition-all text-sm disabled:opacity-50"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>{joining ? 'Registering...' : 'Join Event'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Social Share & Spread the Word */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-emerald-600" />
                <span>Share this initiative with friends:</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShareToX}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 active:scale-95 transition-all"
                  title="Share to X"
                >
                  <XLogo className="w-3.5 h-3.5" />
                  <span>Share on X</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all text-slate-700 dark:text-slate-200"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </button>
              </div>
            </div>

            {/* Participants / Attendees Section */}
            <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Committed Volunteers ({participantCount})
                  </h3>
                </div>
              </div>

              {participants.length === 0 ? (
                <p className="text-sm text-slate-500 italic">
                  Be the first volunteer to step forward and join this local event!
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {participants.map((p, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800"
                    >
                      <img
                        src={
                          p.userPhoto ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                        }
                        alt={p.userName}
                        className="w-8 h-8 rounded-full object-cover border border-emerald-500"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                          {p.userName}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Joined {new Date(p.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
