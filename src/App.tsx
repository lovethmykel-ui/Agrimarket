import { useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { CategoriesSection } from './components/CategoriesSection';
import { SeasonalAvailabilityChart } from './components/SeasonalAvailabilityChart';
import { NigeriaDensityMap } from './components/NigeriaDensityMap';
import { FarmerSpotlightSection } from './components/FarmerSpotlightSection';
import { WaitlistAndAppSection } from './components/WaitlistAndAppSection';
import { ClosingImpactSection } from './components/ClosingImpactSection';
import { Footer } from './components/Footer';
import { ScrollProgressTrack } from './components/MotionPrimitives';
import type { ProduceCategoryId, WaitlistRole, WaitlistStats } from './utils/waitlist';

const INITIAL_STATS: WaitlistStats = {
  totalCount: 8,
  byRole: {
    buyer: 4,
    farmer: 3,
    partner: 1,
  },
  byState: {
    Kaduna: { buyers: 0, farmers: 1, partners: 0, total: 1 },
    Lagos: { buyers: 1, farmers: 0, partners: 0, total: 1 },
    'FCT (Abuja)': { buyers: 1, farmers: 0, partners: 0, total: 1 },
    Oyo: { buyers: 0, farmers: 0, partners: 1, total: 1 },
    Enugu: { buyers: 1, farmers: 0, partners: 0, total: 1 },
    Benue: { buyers: 0, farmers: 1, partners: 0, total: 1 },
    Ogun: { buyers: 0, farmers: 1, partners: 0, total: 1 },
    Rivers: { buyers: 1, farmers: 0, partners: 0, total: 1 },
  },
  topStates: [
    { state: 'Kaduna', count: 1 },
    { state: 'Lagos', count: 1 },
  ],
  recentMembers: [],
};

export default function App() {
  const [stats, setStats] = useState<WaitlistStats>(INITIAL_STATS);
  const [selectedRole, setSelectedRole] = useState<WaitlistRole>('buyer');
  const [selectedCategories, setSelectedCategories] = useState<ProduceCategoryId[]>([
    'vegetables',
    'grains',
  ]);
  const [preselectedState, setPreselectedState] = useState<string>('Lagos');
  const [preselectSeq, setPreselectSeq] = useState<number>(0);

  useEffect(() => {
    let active = true;
    fetch('/api/waitlist/stats')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: WaitlistStats | null) => {
        if (active && data && typeof data.totalCount === 'number') {
          setStats(data);
        }
      })
      .catch(() => {
        // Keep initial deterministic baseline if stats endpoint is temporarily unreachable
      });

    return () => {
      active = false;
    };
  }, []);

  const scrollToWaitlist = () => {
    const el = document.getElementById('waitlist');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectRoleAndScroll = (role: WaitlistRole) => {
    setSelectedRole(role);
    scrollToWaitlist();
  };

  const handleSelectStateAndScroll = (stateName: string) => {
    setPreselectedState(stateName);
    setPreselectSeq((prev) => prev + 1);
    scrollToWaitlist();
  };

  const handleToggleCategory = (categoryId: ProduceCategoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.length > 1 ? prev.filter((id) => id !== categoryId) : prev;
      }
      return [...prev, categoryId];
    });
  };

  const handleJumpToWaitlistWithCategory = (categoryId: ProduceCategoryId) => {
    setSelectedCategories((prev) => (prev.includes(categoryId) ? prev : [...prev, categoryId]));
    scrollToWaitlist();
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#05130A] text-[#F4F7F2]">
        <ScrollProgressTrack />
        <Navbar onJoinWaitlistClick={scrollToWaitlist} />

        <main>
          <HeroSection
            totalWaitlistCount={stats.totalCount}
            onSelectRoleAndScroll={handleSelectRoleAndScroll}
          />

          <AboutSection onReserveSpotClick={scrollToWaitlist} />

          <HowItWorksSection />

          <CategoriesSection
            selectedCategories={selectedCategories}
            onToggleWaitlistCategory={handleToggleCategory}
            onJumpToWaitlistWithCategory={handleJumpToWaitlistWithCategory}
          />

          <SeasonalAvailabilityChart
            onSelectStateAndScroll={handleSelectStateAndScroll}
          />

          <NigeriaDensityMap
            liveByState={stats.byState ?? {}}
            onSelectStateAndScroll={handleSelectStateAndScroll}
          />

          <FarmerSpotlightSection
            onApplyAsFarmerClick={() => handleSelectRoleAndScroll('farmer')}
          />

          <WaitlistAndAppSection
            stats={stats}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
            selectedCategories={selectedCategories}
            onToggleCategory={handleToggleCategory}
            onSignupSuccess={setStats}
            preselectedState={preselectedState}
            preselectSeq={preselectSeq}
          />

          <ClosingImpactSection onJoinWaitlistClick={scrollToWaitlist} />
        </main>

        <Footer
          onSelectRoleAndScroll={handleSelectRoleAndScroll}
          onNewsletterSuccess={setStats}
        />
      </div>
    </MotionConfig>
  );
}
