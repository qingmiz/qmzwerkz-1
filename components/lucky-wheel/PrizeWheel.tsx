'use client';

import { useEffect, useRef, useState } from 'react';

export interface WheelPrize {
  label: string;
  icon: string;
  description?: string;
}

export const DEFAULT_WHEEL_PRIZES: WheelPrize[] = [
  { label: '$5 OFF', icon: '🎉', description: 'Discount code for a future purchase.' },
  { label: '$10 OFF', icon: '💸', description: 'Discount code for a future purchase.' },
  { label: '$10 Shop Credit', icon: '💰', description: '$10 credit toward any purchase in the shop.' },
  { label: 'Mystery Freebie', icon: '🎁', description: 'A surprise free item.' },
  { label: 'FREE Premade Tattoo', icon: '✨', description: 'One free premade tattoo.' },
  { label: 'FREE $10 Membership Access', icon: '💎', description: '$10 worth of membership access, free.' },
  { label: 'FREE Premade Face', icon: '🎭', description: 'One free premade face.' },
  { label: 'FREE Add-On', icon: '➕', description: 'Free add-on - tattoo, makeup, etc.' },
  { label: '15% OFF', icon: '🛍️', description: 'Discount code for a future purchase.' },
  { label: 'Pink Slip (FREE Custom)', icon: '🎟️', description: 'One free custom order.' },
  { label: 'FREE Sleeve Tattoo Add-On', icon: '🖤', description: 'One free sleeve tattoo add-on.' },
  { label: 'FREE Face Edit', icon: '🎨', description: 'One free face edit.' },
  { label: 'BOGO 50% OFF Premades', icon: '🎊', description: 'Buy one premade, get one 50% off.' },
  { label: '$20 Shop Credit (Rare)', icon: '💵', description: '$20 credit toward any purchase in the shop.' },
];

interface Props {
  prizes: WheelPrize[];
  spinning: boolean;
  targetIndex: number | null; // index into prizes to land on
  onSpinEnd?: () => void;
}

export default function PrizeWheel({ prizes, spinning, targetIndex, onSpinEnd }: Props) {
  const segmentAngle = 360 / prizes.length;
  const [rotation, setRotation] = useState(0);
  const spinCount = useRef(0);

  useEffect(() => {
    if (spinning && targetIndex !== null) {
      spinCount.current += 1;
      // Land so the pointer (fixed at top) points at the center of targetIndex's wedge.
      const segmentCenter = targetIndex * segmentAngle + segmentAngle / 2;
      const fullSpins = 5 * 360;
      const target = fullSpins - segmentCenter + spinCount.current; // tiny offset avoids identical-angle no-op transitions
      setRotation(target);

      const timeout = setTimeout(() => {
        onSpinEnd?.();
      }, 4200);

      return () => clearTimeout(timeout);
    }
  }, [spinning, targetIndex, onSpinEnd, segmentAngle]);

  return (
    <div className="relative mx-auto flex h-[380px] w-[380px] items-center justify-center sm:h-[500px] sm:w-[500px]">

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
          background: `conic-gradient(${prizes.map((_, i) =>
            `${i % 2 === 0 ? '#1a0a12' : '#0a0a0a'} ${i * segmentAngle}deg ${(i + 1) * segmentAngle}deg`
          ).join(', ')})`,
        }}
      >
        {prizes.map((prize, i) => {
          const angle = i * segmentAngle + segmentAngle / 2;
          const many = prizes.length > 8;
          const radius = many ? 168 : 155;
          const boxWidth = many ? 54 : 64;
          const fontSize = many ? 7 : 8.5;
          const iconSize = many ? 'text-sm' : 'text-lg';
          return (
            <div
              key={prize.label}
              className={`absolute left-1/2 top-1/2 flex flex-col items-center text-center`}
              style={{
                width: boxWidth,
                transform: `rotate(${angle}deg) translateY(-${radius}px) rotate(${-angle}deg) translateX(-50%)`,
              }}
            >
              <span className={`${iconSize} leading-none`}>{prize.icon}</span>
              <span className="mt-1 font-bold text-white" style={{ fontSize, lineHeight: 1.1 }}>
                {prize.label}
              </span>
            </div>
          );
        })}

        {/* Segment divider lines */}
        {prizes.map((_, i) => (
          <div
            key={`divider-${i}`}
            className="absolute left-1/2 top-1/2 h-1/2 w-[1px] origin-top bg-pink-500/30"
            style={{ transform: `rotate(${i * segmentAngle}deg)` }}
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
