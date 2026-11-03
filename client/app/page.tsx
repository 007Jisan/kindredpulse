'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../lib/api';
import { EventItem } from '../lib/types';
import EventCard from '../components/EventCard';
import SkeletonCard from '../components/SkeletonCard';
import toast from 'react-hot-toast';
import {
  HeartHandshake,
  CalendarDays,
  ShieldCheck,
  Users2,
  Sparkles,
  ArrowRight,
  MapPin,
  CheckCircle,
  Mail,
  Send,
  TreePine,
  Layers,
  Award,
} from 'lucide-react';

export default function HomePage() {
  const [recentEvents, setRecentEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  useEffect(() => {
    async function loadRecentEvents() {
      try {
        setLoading(true);
        // Requirement: Fetch 6 recent upcoming events based on date using .limit()
        const res = await api.events.getAll({ limit: 6, upcomingOnly: true });
        if (res.success && res.events) {
          setRecentEvents(res.events);
        }
      } catch (err) {
        console.error('Failed to load recent events:', err);
      } finally {
        setLoading(false);
      }
    }

    loadRecentEvents();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error('Please provide a valid email address.');
      return;
    }
    toast.success('Thank you for subscribing! You will receive our monthly community service roundup.');
    setNewsletterEmail('');
  };

  // Static Gallery Data
  const galleryItems = [
    {
      title: 'Mirpur Winter Warmth Drive',
      description: 'Distributing hand-knit sweaters and thermals to families in Mirpur 10.',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
      category: 'Donation',
    },
    {
      title: 'Dhanmondi Lake Tree Planting',
      description: 'Volunteers planting native saplings along the Dhanmondi waterfront walkway.',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      category: 'Plantation',
    },
    {
      title: 'Buriganga Riverside Cleanup',
      description: 'Youth volunteers collecting single-use plastic waste from riverside terminals.',
      image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
      category: 'Cleanup',
    },
    {
      title: 'Mohammadpur Blanket Aid',
      description: 'Nighttime fleece blanket distribution for elderly street workers.',
      image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80',
      category: 'Relief',
    },
    {
      title: 'Surplus Food Rescue & Packaging',
      description: 'Hygienically repackaging wholesome bakery and hotel meals for shelter homes.',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
      category: 'Food Rescue',
    },
    {
      title: 'Free Health Screening Clinic',
      description: 'Medical professionals offering free pediatric checkups and vitals screening.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      category: 'Healthcare',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-20 lg:py-32 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800/25 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300/40 dark:border-emerald-700/40 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Empowering Grassroots Action</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Unite for Change, Serve Your{' '}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  Local Community
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                KindredPulse is a community-driven event management platform where citizens initiate, organize, and participate in social development programs—from winter clothing distributions to urban tree plantation projects.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/events"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-lg shadow-emerald-600/30 transition-all text-base"
                >
                  <CalendarDays className="w-5 h-5" />
                  <span>Explore Upcoming Events</span>
                </Link>

                <Link
                  href="/create-event"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 shadow-sm transition-all text-base"
                >
                  <HeartHandshake className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Host an Initiative</span>
                </Link>
              </div>

              {/* Feature Highlights Pills */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Verified Organizers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>100% Free Participation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Direct Neighborhood Impact</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-slate-900 group">
                  <img
                    src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80"
                    alt="Community volunteers packing winter supplies"
                    className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-600">
                      Live Cause
                    </span>
                    <h3 className="text-xl font-bold text-white pt-2">
                      Winter Warmth Drive – Mirpur 10
                    </h3>
                    <p className="text-xs text-slate-300">
                      Over 1,200 warm garments ready for distribution this weekend.
                    </p>
                  </div>
                </div>

                {/* Floating Stat Card */}
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl border border-slate-200 dark:border-slate-700 hidden sm:flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 flex items-center justify-center font-bold">
                    <Users2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      1,480+
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Active Local Volunteers
                    </div>
                  </div>
                </div>

                {/* Floating Plantation Card */}
                <div className="absolute -top-6 -right-6 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl border border-slate-200 dark:border-slate-700 hidden sm:flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/70 text-teal-600 flex items-center justify-center font-bold">
                    <TreePine className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      3,200+
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Trees Planted
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PLATFORM FEATURES SECTION */}
      <section className="py-20 bg-white dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Why KindredPulse
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Built for Transparent, Purpose-Driven Social Action
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
              Discover how our platform empowers everyday citizens to organize humanitarian drives and environmental preservation in their immediate neighborhoods.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Hyper-Local Focus
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Filter and find causes right in your local municipality, from Mirpur to Mohammadpur and Old Dhaka, cutting commute barriers to volunteerism.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
                <Users2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                One-Click Participation
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Log in and join any social initiative with a single click. Keep your participation scheduled and view real-time volunteer rosters.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Organizer Self-Service
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Organizers retain complete self-service authority to update schedules, adjust logistics, and manage attendance for their specific initiatives.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                <CalendarDays className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Temporal Date Guards
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Strict chronological validation ensures all published events occur in the future, automatically preventing expired dates from cluttering listings.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Multi-Sector Classification
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Categorized across winter donations, environmental waste cleanups, coastal mangrove planting, food rescue, and complimentary medical aid.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Verified Social Impact
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Track participation histories, earn community recognition, and build a transparent portfolio of humanitarian community contributions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RECENT UPCOMING EVENTS SECTION (Dynamic from DB, .limit(6)) */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Immediate Opportunities
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                Recent Upcoming Events
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
                Here are 6 upcoming social development initiatives scheduled in your area. Click &ldquo;View Event&rdquo; to review logistics and commit as a volunteer.
              </p>
            </div>

            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 group"
            >
              <span>View All Upcoming Events</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Grid Layout (2 or 3 columns, equal height & width) */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : recentEvents.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <CalendarDays className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                No upcoming events found
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                Be the first to organize a social development event in your neighborhood!
              </p>
              <Link
                href="/create-event"
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700"
              >
                <span>Create an Event</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. GALLERY SECTION (Showcase photographs of community service) */}
      <section className="py-20 bg-white dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Community Gallery
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Moments of Collective Action & Service
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
              Photographs capturing genuine human connection, urban revitalizations, and cold-weather relief projects carried out by dedicated volunteers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item, index) => (
              <div
                key={index}
                className="group relative rounded-3xl overflow-hidden bg-slate-900 shadow-md hover:shadow-2xl transition-all duration-300"
              >
                <div className="h-72 w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-600/90 text-white">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-bold leading-snug">{item.title}</h3>
                  <p className="text-xs text-slate-300 line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. NEWSLETTER SECTION */}
      <section className="py-20 bg-emerald-600 dark:bg-emerald-950 relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white space-y-8">
          <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto text-emerald-200">
            <Mail className="w-8 h-8" />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Stay Informed on Local Social Initiatives
            </h2>
            <p className="text-emerald-100 text-base sm:text-lg max-w-xl mx-auto">
              Subscribe to our monthly community bulletin to receive announcements about upcoming winter relief camps, urban plantations, and volunteer gatherings.
            </p>
          </div>

          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto"
          >
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-5 py-4 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-400/50 shadow-md"
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-lg active:scale-95 transition-all text-sm shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Subscribe</span>
            </button>
          </form>

          <p className="text-xs text-emerald-200/80">
            Zero spam. Unsubscribe with one click anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
