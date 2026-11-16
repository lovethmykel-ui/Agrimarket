import { useState, type FormEvent } from 'react';
import { Loader2, Send } from 'lucide-react';
import { AgriMarkLogo } from './AgriMarkLogo';
import { validateQuickEmail, type WaitlistRole, type WaitlistStats } from '../utils/waitlist';

interface FooterProps {
  onSelectRoleAndScroll: (role: WaitlistRole) => void;
  onNewsletterSuccess: (stats: WaitlistStats) => void;
}

export function Footer({ onSelectRoleAndScroll, onNewsletterSuccess }: FooterProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatusMessage(null);

    const check = validateQuickEmail(email);
    if (!check.valid || !check.normalized) {
      setError(check.error || 'Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: check.normalized }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Unable to subscribe right now.');
        return;
      }

      setStatusMessage(data.message);
      setEmail('');
      if (data.stats) {
        onNewsletterSuccess(data.stats);
      }
    } catch {
      setError('Network error while subscribing. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-white/10 bg-[#040E07] py-14 text-[#CFE0D3]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <a href="#home" aria-label="AgriMarket home" className="inline-block">
              <AgriMarkLogo size="sm" />
            </a>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#A8C2AF]">
              Nigeria&apos;s digital farmer market — Farm Fresh · Fair Price. Currently onboarding
              early-access buyers, growers, and logistics partners ahead of pilot launch.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-sm font-bold text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="#home" className="hover:text-[#84E12B] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#84E12B] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#84E12B] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-[#84E12B] transition-colors">
                  Categories
                </a>
              </li>
            </ul>
          </div>

          {/* Early Access Tracks */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-sm font-bold text-white">Early Access</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectRoleAndScroll('buyer')}
                  className="text-left hover:text-[#84E12B] transition-colors cursor-pointer"
                >
                  For Buyers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectRoleAndScroll('farmer')}
                  className="text-left hover:text-[#84E12B] transition-colors cursor-pointer"
                >
                  For Farmers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectRoleAndScroll('partner')}
                  className="text-left hover:text-[#84E12B] transition-colors cursor-pointer"
                >
                  Logistics Partners
                </button>
              </li>
              <li>
                <a href="#waitlist" className="hover:text-[#84E12B] transition-colors">
                  Check Waitlist Spot
                </a>
              </li>
            </ul>
          </div>

          {/* Launch Updates Quick Subscribe */}
          <div className="lg:col-span-4">
            <h3 className="font-display text-sm font-bold text-white">
              Subscribe for Launch Updates
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#A8C2AF]">
              Get regional launch dates, pilot harvest openings, and farmer onboarding updates.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-4">
              <label htmlFor="footer-newsletter-email" className="sr-only">
                Email address for launch updates
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-[#245933] bg-[#06150B] p-1.5 transition-colors focus-within:border-[#84E12B]">
                <input
                  id="footer-newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="min-h-[38px] w-full bg-transparent px-3 text-sm text-white placeholder-[#6D8F76] focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to launch updates"
                  disabled={submitting}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#84E12B] text-[#05130A] transition-colors hover:bg-[#97F043] disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Send className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {error && <p className="mt-2 text-xs text-[#FCA5A5]">{error}</p>}
              {statusMessage && (
                <p
                  data-testid="newsletter-confirmation"
                  className="mt-2 text-xs font-medium text-[#9FE855]"
                >
                  {statusMessage}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-[#88A891] sm:flex-row">
          <p>&copy; 2026 AgriMarket Nigeria. All rights reserved.</p>
          <p>Growing Together for a Food Secure Nigeria · Built in Nigeria</p>
        </div>
      </div>
    </footer>
  );
}
