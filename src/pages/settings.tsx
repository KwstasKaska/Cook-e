import { useState } from 'react';
import Navbar from '../components/Users/Navbar';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useIsAuth from '../utils/useIsAuth';
import PersonalTab from '../components/Settings/PersonalTab';
import SecurityTab from '../components/Settings/SecurityTab';
import ChefProfileTab from '../components/Settings/ChefProfileTab';
import NutritionistProfileTab from '../components/Settings/NutritionistProfileTab';
import MealPlanTab from '../components/Settings/MealPlanTab';

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = 'CHEF' | 'USER' | 'NUTRITIONIST';

type TabKey =
  | 'personal'
  | 'security'
  | 'chef-profile'
  | 'nutritionist-profile'
  | 'meal-plan';

type Tab = {
  key: TabKey;
  labelKey: string;
  roles: Role[];
};

const TABS: Tab[] = [
  {
    key: 'personal',
    labelKey: 'settings.personalInfo',
    roles: ['USER', 'CHEF', 'NUTRITIONIST'],
  },
  {
    key: 'security',
    labelKey: 'settings.security',
    roles: ['USER', 'CHEF', 'NUTRITIONIST'],
  },
  {
    key: 'chef-profile',
    labelKey: 'settings.chefProfile',
    roles: ['CHEF'],
  },
  {
    key: 'nutritionist-profile',
    labelKey: 'settings.nutritionistProfile',
    roles: ['NUTRITIONIST'],
  },
  {
    key: 'meal-plan',
    labelKey: 'settings.mealPlan',
    roles: ['USER'],
  },
];

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function SettingsPage() {
  const { t } = useTranslation('common');
  const { loading: authLoading, isAuthorized, me } = useIsAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('personal');

  if (authLoading || !isAuthorized || !me) return null;

  const role = me.role.toUpperCase() as Role;
  const visibleTabs = TABS.filter((tab) => tab.roles.includes(role));

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#3F4756' }}>
      <Navbar />

      <div className="relative overflow-hidden min-h-screen">
        <div
          className="absolute bottom-0 left-0 w-full bg-gray-50"
          style={{
            height: '88%',
            clipPath: 'polygon(0 6%, 100% 0%, 100% 100%, 0% 100%)',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-10 pb-20">
          <h1 className="text-white text-3xl font-bold mb-8">
            {t('settings.title')}
          </h1>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Sidebar */}
            <aside className="w-full md:w-56 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                {visibleTabs.map((tab) => {
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-left transition-colors border-l-4"
                      style={{
                        borderLeftColor: isActive ? '#377CC3' : 'transparent',
                        backgroundColor: isActive ? '#F0F7FF' : 'transparent',
                        color: isActive ? '#377CC3' : '#3F4756',
                      }}
                    >
                      <span>{t(tab.labelKey)}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 bg-white rounded-2xl shadow-md overflow-hidden">
                <button
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-left transition-colors hover:bg-red-50"
                  style={{ color: '#ED5B5B' }}
                >
                  <span className="text-base">🗑️</span>
                  <span>{t('settings.deleteAccount')}</span>
                </button>
              </div>
            </aside>

            {/* Main panel */}
            <main className="flex-1 bg-white rounded-2xl shadow-md p-6 md:p-8 min-w-0">
              {activeTab === 'personal' && (
                <PersonalTab username={me.username} email={me.email} />
              )}
              {activeTab === 'security' && <SecurityTab />}
              {activeTab === 'chef-profile' && <ChefProfileTab />}
              {activeTab === 'nutritionist-profile' && (
                <NutritionistProfileTab />
              )}
              {activeTab === 'meal-plan' && <MealPlanTab />}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
