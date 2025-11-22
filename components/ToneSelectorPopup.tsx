'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';

const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional' },
  { value: 'playful', label: 'Playful' },
  { value: 'bold', label: 'Bold' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'custom', label: 'Custom' },
];

interface ToneSelectorPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (tone: string) => void;
  currentTone?: string;
}

export default function ToneSelectorPopup({ isOpen, onClose, onSelect, currentTone }: ToneSelectorPopupProps) {
  const [selectedTone, setSelectedTone] = useState<string>(currentTone || 'professional');
  const [customTone, setCustomTone] = useState<string>('');

  const handleConfirm = () => {
    const tone = selectedTone === 'custom' && customTone.trim() 
      ? customTone.trim() 
      : selectedTone;
    onSelect(tone);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Popup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl p-6 w-full max-w-md mx-4 z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Select Campaign Tone</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Tone Options */}
          <div className="space-y-3 mb-6">
            {TONE_OPTIONS.map((tone) => (
              <button
                key={tone.value}
                onClick={() => setSelectedTone(tone.value)}
                className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                  selectedTone === tone.value
                    ? 'border-blue-500 bg-blue-500/20 text-white'
                    : 'border-white/20 bg-white/5 text-gray-300 hover:border-blue-400/50 hover:bg-white/10'
                }`}
              >
                <span className="font-medium">{tone.label}</span>
              </button>
            ))}
          </div>

          {/* Custom Tone Input */}
          {selectedTone === 'custom' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <label className="block text-sm font-medium text-white/90 mb-2">
                Custom Tone Description
              </label>
              <input
                type="text"
                value={customTone}
                onChange={(e) => setCustomTone(e.target.value)}
                placeholder="e.g., friendly and approachable"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
              />
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              variant="primary"
              className="flex-1"
            >
              Regenerate
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

