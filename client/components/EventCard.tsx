'use client';

import React from 'react';
import Link from 'next/link';
import { EventItem } from '../lib/types';
import { Calendar, MapPin, ArrowRight, Tag } from 'lucide-react';

interface EventCardProps {
  event: EventItem;
}

// Category badge color mapping
function getCategoryColor(type: string): string {
  switch (type?.toLowerCase()) {
    case 'donation':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    case 'cleanup':
      return 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800';
    case 'plantation':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    case 'food rescue':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800';
    case 'healthcare':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    case 'education':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  }
}

export default function EventCard({ event }: EventCardProps) {
  const formattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = new Date(event.eventDate).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-300 overflow-hidden group">
      {/* Thumbnail with Uniform Image Size */}
      <div className="relative w-full h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={event.thumbnail}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Event Type Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border shadow-sm backdrop-blur-md ${getCategoryColor(
              event.eventType
            )}`}
          >
            <Tag className="w-3 h-3" />
            {event.eventType}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {event.title}
        </h3>

        {/* Description snippet */}
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
          {event.description}
        </p>

        {/* Date & Location Meta */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {formattedDate} &bull; {formattedTime}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Card Footer: Organizer & "View Event" Button */}
        <div className="mt-auto pt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs uppercase shrink-0">
              {event.organizerName?.charAt(0) || 'O'}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {event.organizerName || 'Community Host'}
            </span>
          </div>

          <Link
            href={`/events/${event._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-md shadow-emerald-600/20 transition-all shrink-0"
          >
            <span>View Event</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
