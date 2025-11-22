'use client';

import { useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import type { CampaignStatus } from '@/lib/types/campaign.types';

const STATUS_STEPS: { status: CampaignStatus; label: string; description: string }[] = [
  {
    status: 'pending',
    label: 'Initializing',
    description: 'Preparing your campaign...',
  },
  {
    status: 'researching',
    label: 'Researching',
    description: 'Analyzing your brand and website...',
  },
  {
    status: 'generating-content',
    label: 'Creating Content',
    description: 'Generating ad copy for each platform...',
  },
  {
    status: 'generating-images',
    label: 'Creating Visuals',
    description: 'Designing custom ad banners...',
  },
  {
    status: 'critiquing',
    label: 'Self-Review',
    description: 'AI is reviewing and refining content...',
  },
  {
    status: 'completed',
    label: 'Complete',
    description: 'Your campaign is ready!',
  },
];

interface StatusProgressProps {
  currentStatus: CampaignStatus;
  error?: string;
}

export default function StatusProgress({ currentStatus, error }: StatusProgressProps) {
  const currentIndex = STATUS_STEPS.findIndex((step) => step.status === currentStatus);

  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-400 mb-2">Campaign Failed</h3>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* Progress Bar */}
      <div className="relative">
        <div className="overflow-hidden h-2 bg-white/10 rounded-full">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000 ease-out"
            style={{
              width: `${((currentIndex + 1) / STATUS_STEPS.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {STATUS_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <div
              key={step.status}
              className={`flex items-start gap-4 p-4 rounded-lg transition-all duration-300 ${
                isCurrent
                  ? 'bg-blue-500/20 border border-blue-500/50'
                  : isCompleted
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              {/* Icon */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  isCurrent
                    ? 'bg-blue-500'
                    : isCompleted
                    ? 'bg-green-500'
                    : 'bg-white/10'
                }`}
              >
                {isCurrent && <Loader2 className="w-5 h-5 text-white animate-spin" />}
                {isCompleted && <Check className="w-5 h-5 text-white" />}
                {isUpcoming && (
                  <span className="text-sm font-semibold text-gray-400">{index + 1}</span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3
                  className={`font-semibold ${
                    isCurrent
                      ? 'text-blue-300'
                      : isCompleted
                      ? 'text-green-300'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    isCurrent ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  {step.description}
                </p>
              </div>

              {/* Timestamp or status indicator */}
              <div className="flex-shrink-0 text-xs text-gray-500">
                {isCompleted && '✓'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Step Details */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full">
          <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
          <span className="text-sm text-gray-300">
            {STATUS_STEPS[currentIndex]?.description}
          </span>
        </div>
      </div>
    </div>
  );
}
