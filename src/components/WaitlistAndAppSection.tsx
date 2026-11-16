import { useEffect, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  Search,
  Smartphone,
  Sprout,
} from 'lucide-react';
import { PRODUCE_CATALOG } from '../data/content';
import { SoftReveal } from './MotionPrimitives';
import {
  formatQueueNumber,
  NIGERIAN_STATES,
  validateQuickEmail,
  validateWaitlistInput,
  WAITLIST_ROLE_META,
  type ProduceCategoryId,
  type WaitlistRole,
  type WaitlistStats,
} from '../utils/waitlist';

interface ConfirmedPass {
  position: number;
  fullName: string;
  role: WaitlistRole;
  state: string;
  categories: ProduceCategoryId[];
  createdAt: string;
  alreadyRegistered?: boolean;
}

interface WaitlistAndAppSectionProps {
  stats: WaitlistStats;
  selectedRole: WaitlistRole;
  onRoleChange: (role: WaitlistRole) => void;
  selectedCategories: ProduceCategoryId[];
  onToggleCategory: (categoryId: ProduceCategoryId) => void;
  onSignupSuccess: (updatedStats: WaitlistStats) => void;
  preselectedState?: string;
  preselectSeq?: number;
}

const SOFT_TRANSITION = { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const };

export function WaitlistAndAppSection({
  stats,
  selectedRole,
  onRoleChange,
  selectedCategories,
  onToggleCategory,
  onSignupSuccess,
  preselectedState,
  preselectSeq,
}: WaitlistAndAppSectionProps) {
  const [activeTab, setActiveTab] = useState<'join' | 'check'>('join');
  const [previewAppTab, setPreviewAppTab] = useState<'buyer' | 'farmer'>('buyer');

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('Lagos');
  const [farmOrBusinessName, setFarmOrBusinessName] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedPass, setConfirmedPass] = useState<ConfirmedPass | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Status check fields
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<{
    found: boolean;
    entry?: ConfirmedPass;
    newsletterSubscribed?: boolean;
  } | null>(null);

  useEffect(() => {
    setCopiedLink(false);
  }, [confirmedPass]);

  useEffect(() => {
    if (preselectedState) {
      setState(preselectedState);
    }
  }, [preselectedState, preselectSeq]);

  const handleWaitlistSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validation = validateWaitlistInput({
      fullName,
      email,
      phone,
      role: selectedRole,
      state,
      categories: selectedCategories,
      farmOrBusinessName,
    });

    if (!validation.valid || !validation.normalized) {
      setFieldErrors(validation.errors as Record<string, string>);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.normalized),
      });

      const payload = await response.json();

      if (response.status === 409 && payload.existingEntry) {
        setConfirmedPass({
          ...payload.existingEntry,
          alreadyRegistered: true,
        });
        return;
      }

      if (!response.ok) {
        if (payload.fieldErrors) {
          setFieldErrors(payload.fieldErrors);
        }
        setSubmitError(payload.error || 'Unable to submit your registration right now.');
        return;
      }

      setConfirmedPass(payload.entry);
      if (payload.stats) {
        onSignupSuccess(payload.stats);
      }
    } catch {
      setSubmitError('Network error while saving your spot. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLookupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    setLookupResult(null);

    const check = validateQuickEmail(lookupEmail);
    if (!check.valid || !check.normalized) {
      setLookupError(check.error || 'Please enter a valid email address.');
      return;
    }

    setLookupLoading(true);
    try {
      const response = await fetch(
        `/api/waitlist/status?email=${encodeURIComponent(check.normalized)}`
      );
      const data = await response.json();
      if (!response.ok) {
        setLookupError(data.error || 'Unable to look up waitlist status.');
        return;
      }
      setLookupResult(data);
    } catch {
      setLookupError('Network error while checking status. Please try again.');
    } finally {
      setLookupLoading(false);
    }
  };

  const handleCopyInvite = async () => {
    if (!confirmedPass) return;
    const shareText = `I just reserved spot ${formatQueueNumber(
      confirmedPass.position
    )} on the AgriMarket Nigeria waitlist — direct farm-to-buyer produce across Nigeria.`;
    try {
      await navigator.clipboard.writeText(
        `${shareText} ${window.location.origin}/#waitlist`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch {
      setCopiedLink(true);
    }
  };

  const roleMeta = WAITLIST_ROLE_META[selectedRole];

  return (
    <section
      id="waitlist"
      className="scroll-mt-20 border-t border-white/5 bg-[#05130A] py-18 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left column: Sculpted Mobile Companion Preview + Unboxed Live Cohort Ledger */}
          <SoftReveal className="lg:col-span-5">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#84E12B]">
              Early Access &amp; Mobile Preview
            </p>
            <h2 className="mt-2.5 font-display text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Reserve Your Spot Before Launch
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#CFE0D3]">
              Our web marketplace and iOS/Android companion apps are currently in active build. Join
              the waitlist for priority regional onboarding and zero platform fees during our launch
              season.
            </p>

            {/* Sculpted device frame (eliminates generic nested card-in-card) */}
            <div className="mt-8 rounded-[2rem] border border-[#84E12B]/25 bg-gradient-to-b from-[#0F2F1B] via-[#091F11] to-[#06150B] p-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)]">
              {/* Top bezel indicator + mode switch */}
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="h-4 w-4 text-[#84E12B]" aria-hidden="true" />
                  <div className="leading-tight">
                    <div className="text-xs font-bold text-white">AgriMarket App</div>
                    <div className="text-[11px] text-[#9DBBA5]">iOS &amp; Android · In Build</div>
                  </div>
                </div>

                <div className="inline-flex rounded-lg border border-white/10 bg-[#05130A] p-0.5">
                  <button
                    type="button"
                    onClick={() => setPreviewAppTab('buyer')}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                      previewAppTab === 'buyer'
                        ? 'bg-[#84E12B] text-[#05130A]'
                        : 'text-[#A8C2AF] hover:text-white'
                    }`}
                  >
                    Buyer
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewAppTab('farmer')}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                      previewAppTab === 'farmer'
                        ? 'bg-[#84E12B] text-[#05130A]'
                        : 'text-[#A8C2AF] hover:text-white'
                    }`}
                  >
                    Farmer
                  </button>
                </div>
              </div>

              {/* Animated phone screen content */}
              <div className="mt-4 min-h-[154px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={previewAppTab}
                    initial={{ opacity: 0, y: 6, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -6, filter: 'blur(6px)' }}
                    transition={SOFT_TRANSITION}
                  >
                    <div className="flex items-center justify-between pb-3">
                      <div className="flex items-center gap-2">
                        <Sprout className="h-4 w-4 text-[#84E12B]" aria-hidden="true" />
                        <span className="font-display text-xs font-bold text-white">
                          {previewAppTab === 'buyer'
                            ? 'Fresh Harvest Corridors'
                            : 'Farm Harvest Console'}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-[#9FE855]">Preview UI</span>
                    </div>

                    {previewAppTab === 'buyer' ? (
                      <div className="divide-y divide-white/10 border-t border-white/10">
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <div className="text-xs font-semibold text-white">
                              Kaduna Roma Tomatoes
                            </div>
                            <div className="text-[11px] text-[#9DBBA5]">
                              25kg Crate · Direct Farm-Gate
                            </div>
                          </div>
                          <span className="font-mono-nums text-xs font-semibold text-[#84E12B]">
                            Escrow Ready
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <div className="text-xs font-semibold text-white">
                              Kebbi Parboiled Rice
                            </div>
                            <div className="text-[11px] text-[#9DBBA5]">
                              50kg Bag · Stone-Free Mill
                            </div>
                          </div>
                          <span className="font-mono-nums text-xs font-semibold text-[#84E12B]">
                            Pre-Order
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="divide-y divide-white/10 border-t border-white/10">
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <div className="text-xs font-semibold text-white">
                              List Harvest Lot
                            </div>
                            <div className="text-[11px] text-[#9DBBA5]">
                              Set tonnage &amp; farm-gate price
                            </div>
                          </div>
                          <span className="font-mono-nums text-xs font-semibold text-[#84E12B]">
                            0% Pilot Fee
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <div className="text-xs font-semibold text-white">
                              Hub Pickup Dispatch
                            </div>
                            <div className="text-[11px] text-[#9DBBA5]">
                              Scheduled cold-chain logistics
                            </div>
                          </div>
                          <span className="font-mono-nums text-xs font-semibold text-[#84E12B]">
                            Direct Payout
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Unboxed, hairline-separated Live Cohort Ledger */}
            <div className="mt-7 border-t border-white/10 pt-5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Live Cohort Breakdown</span>
                <span className="font-mono-nums font-bold text-[#84E12B] tabular-nums">
                  {stats.totalCount} total
                </span>
              </div>

              <div className="mt-3.5 grid grid-cols-3 divide-x divide-white/10">
                <div className="pr-3">
                  <div className="font-mono-nums text-xl font-bold text-white tabular-nums">
                    {stats.byRole.buyer}
                  </div>
                  <div className="text-xs text-[#9DBBA5]">Buyers</div>
                </div>
                <div className="px-4">
                  <div className="font-mono-nums text-xl font-bold text-white tabular-nums">
                    {stats.byRole.farmer}
                  </div>
                  <div className="text-xs text-[#9DBBA5]">Farmers</div>
                </div>
                <div className="pl-4">
                  <div className="font-mono-nums text-xl font-bold text-white tabular-nums">
                    {stats.byRole.partner}
                  </div>
                  <div className="text-xs text-[#9DBBA5]">Partners</div>
                </div>
              </div>

              {stats.topStates.length > 0 && (
                <p className="mt-4 text-xs text-[#A8C2AF]">
                  <span className="font-semibold text-white">Active states: </span>
                  {stats.topStates.slice(0, 4).map((item, idx) => (
                    <span key={item.state}>
                      {item.state}
                      {idx < Math.min(stats.topStates.length, 4) - 1 ? ' · ' : ''}
                    </span>
                  ))}
                </p>
              )}
            </div>
          </SoftReveal>

          {/* Right column: Interactive Waitlist Form Card */}
          <SoftReveal delay={0.08} className="lg:col-span-7">
            <div className="editorial-surface rounded-3xl border editorial-hairline p-6 sm:p-8 shadow-[0_24px_70px_-24px_rgba(0,0,0,0.85)]">
              {/* Top Mode Switcher: Join Waitlist vs Check My Spot */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
                    Early-Access Waiting List
                  </h3>
                  <p className="mt-1 text-xs text-[#A8C2AF]">
                    Takes 30 seconds · Invitations roll out by state corridor
                  </p>
                </div>

                <div
                  role="tablist"
                  aria-label="Waitlist mode"
                  className="inline-flex rounded-xl border border-white/10 bg-[#05130A] p-1"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'join'}
                    onClick={() => setActiveTab('join')}
                    className={`min-h-[38px] rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === 'join'
                        ? 'bg-[#84E12B] text-[#05130A]'
                        : 'text-[#CFE0D3] hover:text-white'
                    }`}
                  >
                    Join Waitlist
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'check'}
                    onClick={() => setActiveTab('check')}
                    className={`min-h-[38px] rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === 'check'
                        ? 'bg-[#84E12B] text-[#05130A]'
                        : 'text-[#CFE0D3] hover:text-white'
                    }`}
                  >
                    Check My Spot
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'check' ? (
                  <motion.div
                    key="tab-check"
                    initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -6, filter: 'blur(6px)' }}
                    transition={SOFT_TRANSITION}
                    className="mt-6"
                  >
                    <form onSubmit={handleLookupSubmit} noValidate className="space-y-4">
                      <div>
                        <label
                          htmlFor="lookup-email"
                          className="block text-sm font-medium text-[#E5F0E7]"
                        >
                          Registered Email Address
                        </label>
                        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                          <input
                            id="lookup-email"
                            type="email"
                            value={lookupEmail}
                            onChange={(e) => setLookupEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="min-h-[46px] w-full rounded-xl border border-[#2B633B] bg-[#05130A] px-4 text-sm text-white placeholder-[#6D8F76] transition-colors focus:border-[#84E12B] focus:outline-none focus:ring-2 focus:ring-[#84E12B]/30"
                          />
                          <button
                            type="submit"
                            disabled={lookupLoading}
                            className="inline-flex min-h-[46px] shrink-0 items-center justify-center gap-2 rounded-xl bg-[#84E12B] px-5 py-2.5 text-sm font-bold text-[#05130A] whitespace-nowrap transition-colors hover:bg-[#97F043] disabled:opacity-60 cursor-pointer"
                          >
                            {lookupLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            ) : (
                              <Search className="h-4 w-4" aria-hidden="true" />
                            )}
                            <span>Check Status</span>
                          </button>
                        </div>
                        {lookupError && (
                          <p className="mt-2 text-xs font-medium text-[#FCA5A5]">{lookupError}</p>
                        )}
                      </div>
                    </form>

                    {lookupResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={SOFT_TRANSITION}
                        data-testid="waitlist-lookup-result"
                        className="mt-6 rounded-2xl border border-[#2B633B] bg-[#05130A] p-5"
                      >
                        {lookupResult.found && lookupResult.entry ? (
                          <div>
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2 text-sm font-semibold text-[#84E12B]">
                                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                                <span>Confirmed on Early-Access List</span>
                              </div>
                              <span className="font-mono-nums text-lg font-bold text-white tabular-nums">
                                {formatQueueNumber(lookupResult.entry.position)}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-[#CFE0D3]">
                              {lookupResult.entry.fullName} ·{' '}
                              {WAITLIST_ROLE_META[lookupResult.entry.role].label} ·{' '}
                              {lookupResult.entry.state}
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-[#CFE0D3]">
                              {lookupResult.newsletterSubscribed
                                ? 'You are subscribed to launch alerts, but have not claimed a full waitlist queue spot yet.'
                                : 'No waitlist registration found for that email address yet.'}
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setEmail(lookupEmail);
                                setActiveTab('join');
                              }}
                              className="inline-flex min-h-[40px] shrink-0 items-center justify-center rounded-lg bg-[#84E12B] px-4 py-2 text-xs font-bold text-[#05130A] whitespace-nowrap hover:bg-[#97F043] cursor-pointer"
                            >
                              Reserve Spot Now
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                ) : confirmedPass ? (
                  <motion.div
                    key="tab-confirmed"
                    initial={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, filter: 'blur(6px)' }}
                    transition={SOFT_TRANSITION}
                    data-testid="waitlist-confirmation"
                    className="mt-6 rounded-2xl border border-[#84E12B]/55 bg-gradient-to-br from-[#0B2715] to-[#05130A] p-6 shadow-[0_0_40px_-14px_rgba(132,225,43,0.4)]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#84E12B]">
                          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                          <span>
                            {confirmedPass.alreadyRegistered
                              ? 'You Are Already on the Waitlist'
                              : 'Waitlist Spot Confirmed'}
                          </span>
                        </div>
                        <h4 className="mt-2 font-display text-2xl font-bold text-white">
                          Welcome aboard, {confirmedPass.fullName}
                        </h4>
                      </div>

                      <div className="border-l border-white/15 pl-4 text-right">
                        <div className="text-[11px] font-medium text-[#A8C2AF]">Queue Position</div>
                        <div className="font-mono-nums text-3xl font-extrabold text-[#84E12B] tabular-nums">
                          {formatQueueNumber(confirmedPass.position)}
                        </div>
                      </div>
                    </div>

                    <dl className="mt-5 grid grid-cols-1 gap-3 border-t border-white/10 pt-5 text-sm sm:grid-cols-3">
                      <div>
                        <dt className="text-xs text-[#9DBBA5]">Track</dt>
                        <dd className="mt-0.5 font-semibold text-white">
                          {WAITLIST_ROLE_META[confirmedPass.role].shortLabel}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-[#9DBBA5]">State</dt>
                        <dd className="mt-0.5 font-semibold text-white">{confirmedPass.state}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-[#9DBBA5]">Categories</dt>
                        <dd className="mt-0.5 font-semibold capitalize text-white">
                          {confirmedPass.categories.join(', ')}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleCopyInvite}
                        className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#84E12B] px-4 py-2 text-sm font-bold text-[#05130A] whitespace-nowrap hover:bg-[#97F043] cursor-pointer"
                      >
                        {copiedLink ? (
                          <>
                            <Check className="h-4 w-4" aria-hidden="true" />
                            <span>Invite Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" aria-hidden="true" />
                            <span>Share Waitlist Invite</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setConfirmedPass(null);
                          setFullName('');
                          setEmail('');
                          setPhone('');
                          setFarmOrBusinessName('');
                        }}
                        className="inline-flex min-h-[42px] items-center rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-[#CFE0D3] whitespace-nowrap hover:border-[#84E12B]/60 hover:text-white cursor-pointer"
                      >
                        Register Another Person
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="tab-form"
                    initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -6, filter: 'blur(6px)' }}
                    transition={SOFT_TRANSITION}
                    onSubmit={handleWaitlistSubmit}
                    noValidate
                    className="mt-6 space-y-5"
                  >
                    {/* Role selector */}
                    <div>
                      <span className="block text-sm font-medium text-[#E5F0E7]">
                        I am joining as
                      </span>
                      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                        {(['buyer', 'farmer', 'partner'] as WaitlistRole[]).map((roleKey) => {
                          const isSelected = selectedRole === roleKey;
                          return (
                            <button
                              key={roleKey}
                              type="button"
                              aria-pressed={isSelected}
                              onClick={() => onRoleChange(roleKey)}
                              className={`flex min-h-[44px] items-center justify-center rounded-xl border px-3 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                                isSelected
                                  ? 'border-[#84E12B] bg-[#163F24] text-[#9FE855] shadow-[0_0_20px_-8px_rgba(132,225,43,0.45)]'
                                  : 'border-white/15 bg-[#05130A] text-[#CFE0D3] hover:border-[#84E12B]/50 hover:text-white'
                              }`}
                            >
                              {WAITLIST_ROLE_META[roleKey].label}
                            </button>
                          );
                        })}
                      </div>
                      <p className="mt-2 text-xs text-[#A8C2AF]">{roleMeta.description}</p>
                    </div>

                    {/* Name & Email */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="waitlist-fullName"
                          className="block text-sm font-medium text-[#E5F0E7]"
                        >
                          Full Name <span className="text-[#84E12B]">*</span>
                        </label>
                        <input
                          id="waitlist-fullName"
                          name="fullName"
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Chinedu Okafor"
                          className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#2B633B] bg-[#05130A] px-3.5 text-sm text-white placeholder-[#6D8F76] transition-colors focus:border-[#84E12B] focus:outline-none focus:ring-2 focus:ring-[#84E12B]/30"
                        />
                        {fieldErrors.fullName && (
                          <p className="mt-1 text-xs text-[#FCA5A5]">{fieldErrors.fullName}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="waitlist-email"
                          className="block text-sm font-medium text-[#E5F0E7]"
                        >
                          Email Address <span className="text-[#84E12B]">*</span>
                        </label>
                        <input
                          id="waitlist-email"
                          name="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#2B633B] bg-[#05130A] px-3.5 text-sm text-white placeholder-[#6D8F76] transition-colors focus:border-[#84E12B] focus:outline-none focus:ring-2 focus:ring-[#84E12B]/30"
                        />
                        {fieldErrors.email && (
                          <p className="mt-1 text-xs text-[#FCA5A5]">{fieldErrors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Phone & State */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="waitlist-phone"
                          className="block text-sm font-medium text-[#E5F0E7]"
                        >
                          Phone / WhatsApp (Optional)
                        </label>
                        <input
                          id="waitlist-phone"
                          name="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 0803 123 4567"
                          className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#2B633B] bg-[#05130A] px-3.5 text-sm text-white placeholder-[#6D8F76] transition-colors focus:border-[#84E12B] focus:outline-none focus:ring-2 focus:ring-[#84E12B]/30"
                        />
                        {fieldErrors.phone && (
                          <p className="mt-1 text-xs text-[#FCA5A5]">{fieldErrors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="waitlist-state"
                          className="block text-sm font-medium text-[#E5F0E7]"
                        >
                          State in Nigeria <span className="text-[#84E12B]">*</span>
                        </label>
                        <select
                          id="waitlist-state"
                          name="state"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#2B633B] bg-[#05130A] px-3.5 text-sm text-white transition-colors focus:border-[#84E12B] focus:outline-none focus:ring-2 focus:ring-[#84E12B]/30"
                        >
                          {NIGERIAN_STATES.map((st) => (
                            <option key={st} value={st} className="bg-[#05130A] text-white">
                              {st}
                            </option>
                          ))}
                        </select>
                        {fieldErrors.state && (
                          <p className="mt-1 text-xs text-[#FCA5A5]">{fieldErrors.state}</p>
                        )}
                      </div>
                    </div>

                    {/* Farm / Business Name */}
                    <div>
                      <label
                        htmlFor="waitlist-org"
                        className="block text-sm font-medium text-[#E5F0E7]"
                      >
                        Farm, Cooperative, or Business Name (Optional)
                      </label>
                      <input
                        id="waitlist-org"
                        name="farmOrBusinessName"
                        type="text"
                        value={farmOrBusinessName}
                        onChange={(e) => setFarmOrBusinessName(e.target.value)}
                        placeholder={roleMeta.orgPlaceholder}
                        className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#2B633B] bg-[#05130A] px-3.5 text-sm text-white placeholder-[#6D8F76] transition-colors focus:border-[#84E12B] focus:outline-none focus:ring-2 focus:ring-[#84E12B]/30"
                      />
                    </div>

                    {/* Produce Interests */}
                    <div>
                      <span className="block text-sm font-medium text-[#E5F0E7]">
                        Produce Categories of Interest
                      </span>
                      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {PRODUCE_CATALOG.map((cat) => {
                          const checked = selectedCategories.includes(cat.id);
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              aria-pressed={checked}
                              onClick={() => onToggleCategory(cat.id)}
                              className={`flex min-h-[40px] items-center justify-between rounded-xl border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                                checked
                                  ? 'border-[#84E12B] bg-[#163F24] text-[#9FE855]'
                                  : 'border-white/15 bg-[#05130A] text-[#CFE0D3] hover:border-[#84E12B]/50 hover:text-white'
                              }`}
                            >
                              <span>{cat.name}</span>
                              {checked && (
                                <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {submitError && (
                      <div
                        role="alert"
                        className="rounded-xl border border-[#EF4444]/40 bg-[#450A0A]/50 px-4 py-3 text-xs font-medium text-[#FECACA]"
                      >
                        {submitError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#84E12B] px-6 py-3 text-sm font-bold text-[#05130A] shadow-[0_10px_28px_-8px_rgba(132,225,43,0.45)] transition-all duration-150 hover:bg-[#97F043] hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#84E12B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B2213] disabled:opacity-60 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          <span>Reserving Your Spot...</span>
                        </>
                      ) : (
                        <span>{roleMeta.ctaLabel}</span>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </SoftReveal>
        </div>
      </div>
    </section>
  );
}
