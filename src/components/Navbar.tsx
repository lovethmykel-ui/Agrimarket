import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { AgriMarkLogo } from './AgriMarkLogo';

interface NavbarProps {
  onJoinWaitlistClick: () => void;
}

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Categories', href: '#categories' },
  { label: 'Waitlist', href: '#waitlist' },
];

export function Navbar({ onJoinWaitlistClick }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileAction = () => {
    setMobileOpen(false);
    onJoinWaitlistClick();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05130A]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line Animated Brand Wordmark */}
        <a
          href="#home"
          aria-label="AgriMarket home"
          className="whitespace-nowrap shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#84E12B]"
        >
          <AgriMarkLogo size="sm" />
        </a>

        {/* Zone 2: 5 concise single-line text links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#CFE0D3]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative whitespace-nowrap shrink-0 py-1 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#84E12B] rounded group"
            >
              <span>{link.label}</span>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-[1.5px] origin-left scale-x-0 bg-[#84E12B] transition-transform duration-200 group-hover:scale-x-100"
              />
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action + mobile drawer trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onJoinWaitlistClick}
            className="hidden sm:inline-flex items-center justify-center rounded-xl bg-[#84E12B] px-4 py-2 text-sm font-bold text-[#05130A] whitespace-nowrap shrink-0 shadow-[0_0_24px_-6px_rgba(132,225,43,0.55)] transition-all duration-150 hover:bg-[#97F043] hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#84E12B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#05130A] cursor-pointer"
          >
            Join Waitlist
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 text-white md:hidden hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#84E12B] cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-white/10 bg-[#06180C]/95 px-4 py-4 backdrop-blur-xl md:hidden"
          >
            <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-[44px] items-center rounded-xl px-3 text-base font-medium text-[#DFECE2] hover:bg-white/5 hover:text-[#84E12B]"
                >
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                onClick={handleMobileAction}
                className="mt-2 flex min-h-[44px] w-full items-center justify-center rounded-xl bg-[#84E12B] px-4 py-2.5 text-sm font-bold text-[#05130A] hover:bg-[#97F043] cursor-pointer"
              >
                Join Waitlist
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
