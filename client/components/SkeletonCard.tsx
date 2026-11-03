'use client';

import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Image Skeleton */}
      <div className="w-full h-52 skeleton-shimmer bg-slate-200 dark:bg-slate-800" />

      {/* Content Skeleton */}
      <div className="p-6 flex flex-col flex-1 space-y-4">
        {/* Badge */}
        <div className="w-24 h-5 rounded-full skeleton-shimmer bg-slate-200 dark:bg-slate-800" />

        {/* Title */}
        <div className="space-y-2">
          <div className="w-5/6 h-5 rounded-lg skeleton-shimmer bg-slate-200 dark:bg-slate-800" />
          <div className="w-3/5 h-5 rounded-lg skeleton-shimmer bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Description */}
        <div className="space-y-2 pt-2">
          <div className="w-full h-3 rounded skeleton-shimmer bg-slate-200 dark:bg-slate-800" />
          <div className="w-4/5 h-3 rounded skeleton-shimmer bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Date & Location */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="w-1/2 h-4 rounded skeleton-shimmer bg-slate-200 dark:bg-slate-800" />
          <div className="w-2/3 h-4 rounded skeleton-shimmer bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="w-20 h-4 rounded skeleton-shimmer bg-slate-200 dark:bg-slate-800" />
          <div className="w-28 h-9 rounded-xl skeleton-shimmer bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}
