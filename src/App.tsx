import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DrawMechanismSection } from './components/DrawMechanismSection';
import { CharityDirectorySection } from './components/CharityDirectorySection';
import { PricingSection } from './components/PricingSection';
import { UserDashboardView } from './components/UserDashboardView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { SubscribeModal } from './components/SubscribeModal';
import { SystemDesignModal } from './components/SystemDesignModal';
import { EvaluatorTour } from './components/EvaluatorTour';
import { Footer } from './components/Footer';
import { SubscriptionPlan } from './types';

const MainAppContent: React.FC = () => {
  const { currentRole, setCurrentRole } = useApp();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState<boolean>(false);
  const [isSystemDesignOpen, setIsSystemDesignOpen] = useState<boolean>(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<SubscriptionPlan>('monthly');

  const handleOpenSubscribe = (plan: SubscriptionPlan = 'monthly') => {
    setSelectedPlanForCheckout(plan);
    setIsSubscribeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      <div>
        {/* Navigation & Role Controls */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openSubscribeModal={() => handleOpenSubscribe('monthly')}
          openSystemDesignModal={() => setIsSystemDesignOpen(true)}
        />

        {/* Main Routed Content */}
        <main>
          {activeTab === 'home' && (
            <>
              <HeroSection
                onSubscribeClick={() => handleOpenSubscribe('monthly')}
                onExploreCharities={() => setActiveTab('charities')}
                onEnterScores={() => setActiveTab('dashboard')}
              />
              <DrawMechanismSection />
              <CharityDirectorySection onSelectForSubscription={() => handleOpenSubscribe('monthly')} />
              <PricingSection onSelectPlan={(plan) => handleOpenSubscribe(plan)} />
            </>
          )}

          {activeTab === 'charities' && (
            <div className="py-6">
              <CharityDirectorySection onSelectForSubscription={() => handleOpenSubscribe('monthly')} />
            </div>
          )}

          {activeTab === 'draws' && (
            <div className="py-6">
              <DrawMechanismSection />
            </div>
          )}

          {activeTab === 'dashboard' && (
            <UserDashboardView
              onOpenSubscribe={() => handleOpenSubscribe('monthly')}
              onExploreCharities={() => setActiveTab('charities')}
            />
          )}

          {activeTab === 'admin' && (
            <AdminDashboardView />
          )}
        </main>
      </div>

      {/* Global Subscription Modal */}
      <SubscribeModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
        initialPlan={selectedPlanForCheckout}
      />

      {/* System Architecture & Spec Modal */}
      <SystemDesignModal
        isOpen={isSystemDesignOpen}
        onClose={() => setIsSystemDesignOpen(false)}
      />

      {/* Floating Evaluator Tour Guide (§ 16.1 Testing Checklist Companion) */}
      <EvaluatorTour onNavigateTab={(tab) => setActiveTab(tab)} />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
