import { motion } from 'motion/react';

interface AgriMarkLogoProps {
  size?: 'sm' | 'md';
  showWordmark?: boolean;
}

export function AgriMarkLogo({ size = 'md', showWordmark = true }: AgriMarkLogoProps) {
  const boxSize = size === 'sm' ? 'h-8 w-8' : 'h-9 w-9';
  const textSize = size === 'sm' ? 'text-base' : 'text-lg';

  return (
    <span className="group inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 select-none">
      <motion.span
        initial="rest"
        whileHover="hover"
        animate="visible"
        className={`relative flex ${boxSize} items-center justify-center overflow-hidden rounded-xl border border-[#84E12B]/40 bg-gradient-to-br from-[#164A26] via-[#0B2814] to-[#06150B] shadow-[0_0_20px_-6px_rgba(132,225,43,0.45)]`}
      >
        {/* Soft sunlit shimmer sweep on hover */}
        <motion.span
          aria-hidden="true"
          variants={{
            rest: { x: '-140%', opacity: 0 },
            visible: { x: '-140%', opacity: 0 },
            hover: {
              x: '140%',
              opacity: [0, 0.45, 0],
              transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
            },
          }}
          className="pointer-events-none absolute inset-y-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-[#B7F474]/60 to-transparent"
        />

        <svg
          viewBox="0 0 36 36"
          fill="none"
          aria-hidden="true"
          className="relative z-10 h-6 w-6"
        >
          {/* Horizon / terrace farmland arcs */}
          <motion.path
            d="M5 26.5C10.5 23.2 25.5 23.2 31 26.5"
            stroke="#549E3B"
            strokeWidth="1.75"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.path
            d="M8.5 30C13.2 27.6 22.8 27.6 27.5 30"
            stroke="#3B7A29"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.85 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Central rising stem */}
          <motion.path
            d="M18 24.5V11"
            stroke="#84E12B"
            strokeWidth="2.1"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Left unfurling leaf */}
          <motion.path
            d="M18 20.5C13 20.5 9.5 17 9.5 12C14.2 12 18 15 18 20.5Z"
            fill="#84E12B"
            fillOpacity="0.22"
            stroke="#84E12B"
            strokeWidth="1.75"
            strokeLinejoin="round"
            variants={{
              rest: { rotate: 0 },
              visible: {
                scale: [0.82, 1],
                opacity: [0, 1],
                transition: { duration: 0.55, delay: 0.25, ease: [0.16, 1, 0.3, 1] },
              },
              hover: {
                rotate: -6,
                transition: { type: 'spring', stiffness: 320, damping: 18 },
              },
            }}
            style={{ transformOrigin: '18px 20.5px' }}
          />

          {/* Right unfurling leaf */}
          <motion.path
            d="M18 17.5C22.8 17.5 26.5 14 26.5 9.2C21.8 9.2 18 12.2 18 17.5Z"
            fill="#84E12B"
            fillOpacity="0.92"
            stroke="#A5F34B"
            strokeWidth="1.4"
            strokeLinejoin="round"
            variants={{
              rest: { rotate: 0 },
              visible: {
                scale: [0.82, 1],
                opacity: [0, 1],
                transition: { duration: 0.55, delay: 0.35, ease: [0.16, 1, 0.3, 1] },
              },
              hover: {
                rotate: 6,
                transition: { type: 'spring', stiffness: 320, damping: 18 },
              },
            }}
            style={{ transformOrigin: '18px 17.5px' }}
          />

          {/* Seed / sun crown node */}
          <motion.circle
            cx="18"
            cy="7.5"
            r="2.1"
            fill="#D4FC8C"
            animate={{
              scale: [1, 1.18, 1],
              opacity: [0.85, 1, 0.85],
            }}
            transition={{
              duration: 3.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </svg>
      </motion.span>

      {showWordmark && (
        <span className={`font-display ${textSize} font-bold tracking-tight text-white whitespace-nowrap`}>
          Agri<span className="text-[#84E12B]">Market</span>
        </span>
      )}
    </span>
  );
}
