'use client';

import { useEffect, useRef, useState } from 'react';

export interface WheelPrize {
  label: string;
  icon: string;
  description?: string;
}

// Order matches the segments visually, going clockwise from the top.
export const WHEEL_PRIZES: WheelPrize[] = [
  { label: 'FREE Head', icon: '🆓', description: 'One free premade or custom head.' },
  { label: '$5 Store Credit', icon: '💵', description: '$5 credit toward any purchase in the shop.' },
  { label: '10% OFF', icon: '🏷️', description: 'Discount code for a future purchase.' },
  { label: 'Random Tattoo', icon: '🖋️', description: 'One random tattoo from the collection.' },
  { label: 'FREE Clothing', icon: '👕', description: 'One free clothing item or clothing pack.' },
  { label: 'Premium Skin', icon: '⭐', description: 'A premium premade skin.' },
  { label: 'Weapon Pack', icon: '🔫', description: 'One custom weapon pack.' },
  { label: 'JACKPOT', icon: '🎉', description: 'The grand prize.' },
];

const SEGMENT_ANGLE = 360 / WHEEL_PRIZES.length;

interface Props {
  spinning: boolean;
  targetIndex: number | null; // index into WHEEL_PRIZES to land on
  onSpinEnd?: () => void;
}

export default function PrizeWheel({ spinning, targetIndex, onSpinEnd }: Props) {
  const [rotation, setRotation] = useState(0);
  const spinCount = useRef(0);

  useEffect(() => {
    if (spinning && targetIndex !== null) {
      spinCount.current += 1;
      // Land so the pointer (fixed at top) points at the center of targetIndex's wedge.
      const segmentCenter = targetIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
      const fullSpins = 6 * 360;
      const target = fullSpins - segmentCenter + spinCount.current; // tiny offset avoids identical-angle no-op transitions
      setRotation(target);

      const timeout = setTimeout(() => {
        onSpinEnd?.();
      }, 4200);

      return () => clearTimeout(timeout);
    }
  }, [spinning, targetIndex, onSpinEnd]);

  return (
    <div className="relative mx-auto flex h-[360px] w-[360px] items-center justify-center sm:h-[460px] sm:w-[460px]">

      {/* Pointer */}
      <div
        className="absolute top-[-6px] left-1/2 z-20 h-8 w-8 -translate-x-1/2 rotate-180"
        style={{ filter: 'drop-shadow(0 0 6px rgba(236,72,153,0.9))' }}
      >
        <svg viewBox="0 0 24 24" fill="#ec4899">
          <path d="M12 24 L2 4 L22 4 Z" />
        </svg>
      </div>

      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(236,72,153,0.25) 0%, rgba(0,0,0,0) 70%)',
        }}
      />

      {/* Wheel */}
      <div
        className="relative h-full w-full rounded-full border-4"
        style={{
          borderColor: '#ec4899',
          boxShadow: '0 0 30px rgba(236,72,153,0.6), inset 0 0 30px rgba(236,72,153,0.3)',
          transform: `rotate(${rotation}deg)`,
          transition: spinning ? 'transform 4.2s cubic-bezier(0.15, 0.85, 0.25, 1)' : 'none',
          background: `conic-gradient(${WHEEL_PRIZES.map((_, i) =>
            `${i % 2 === 0 ? '#1a0a12' : '#0a0a0a'} ${i * SEGMENT_ANGLE}deg ${(i + 1) * SEGMENT_ANGLE}deg`
          ).join(', ')})`,
        }}
      >
        {WHEEL_PRIZES.map((prize, i) => {
          const angle = i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
          return (
            <div
              key={prize.label}
              className="absolute left-1/2 top-1/2 flex w-[64px] -translate-x-1/2 flex-col items-center text-center"
              style={{
                transform: `rotate(${angle}deg) translateY(-155px) rotate(${-angle}deg)`,
              }}
            >
              <span className="text-lg leading-none">{prize.icon}</span>
              <span className="mt-1 text-[8.5px] font-bold leading-[1.15] text-white">
                {prize.label}
              </span>
            </div>
          );
        })}

        {/* Segment divider lines */}
        {WHEEL_PRIZES.map((_, i) => (
          <div
            key={`divider-${i}`}
            className="absolute left-1/2 top-1/2 h-1/2 w-[1px] origin-top bg-pink-500/30"
            style={{ transform: `rotate(${i * SEGMENT_ANGLE}deg)` }}
          />
        ))}
      </div>

      {/* Center hub with logo */}
      <div
        className="absolute z-10 flex h-20 w-20 items-center justify-center rounded-full border-2 border-pink-500 bg-black"
        style={{ boxShadow: '0 0 20px rgba(236,72,153,0.8)' }}
      >
        <img
          src="/logos/qmz-icon.png"
          alt="QMZ"
          className="h-14 w-14 object-contain"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
    </div>
  );
}
