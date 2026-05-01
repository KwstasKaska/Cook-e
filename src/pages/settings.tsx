import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Users/Navbar';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useIsAuth from '../utils/useIsAuth';
import PersonalTab from '../components/Settings/PersonalTab';
import SecurityTab from '../components/Settings/SecurityTab';
import ChefProfileTab from '../components/Settings/ChefProfileTab';
import NutritionistProfileTab from '../components/Settings/NutritionistProfileTab';
import MealPlanTab from '../components/Settings/MealPlanTab';
import ChefNavbar from '../components/Chef/ChefNavbar';
import NutrNavbar from '../components/Nutritionist/NutrNavbar';
import { useDeleteUserMutation } from '../generated/graphql';
import { useApolloClient } from '@apollo/client';

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
  const router = useRouter();
  const { loading: authLoading, isAuthorized, me } = useIsAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('personal');
  const [deleteError, setDeleteError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const apolloClient = useApolloClient();

  const [deleteUser, { loading: deleting }] = useDeleteUserMutation();

  const handleDeleteAccount = async () => {
    setDeleteError('');
    try {
      const result = await deleteUser();
      if (!result.data?.deleteUser) {
        setDeleteError(t('settings.deleteError'));
        return;
      }
      await apolloClient.clearStore();
      router.push('/login');
    } catch {
      setDeleteError(t('settings.deleteError'));
    }
  };

  if (authLoading || !isAuthorized || !me) return null;

  const role = me.role.toUpperCase() as Role;
  const visibleTabs = TABS.filter((tab) => tab.roles.includes(role));

  const activeTabLabel = t(
    visibleTabs.find((tab) => tab.key === activeTab)?.labelKey ?? '',
  );

  const renderNavbar = () => {
    if (role === 'CHEF') return <ChefNavbar />;
    if (role === 'NUTRITIONIST') return <NutrNavbar />;
    return <Navbar />;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#3F4756' }}>
      {renderNavbar()}

      <div className="relative overflow-hidden min-h-screen">
        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-10 pb-20">
          <h1 className="text-white text-3xl font-bold mb-8">
            {t('settings.title')}
          </h1>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <aside className="w-full md:w-56 flex-shrink-0">
              <nav aria-label={t('settings.title')}>
                <div
                  role="tablist"
                  aria-label={t('settings.title')}
                  className="bg-white rounded-2xl shadow-md overflow-hidden"
                >
                  {visibleTabs.map((tab) => {
                    const isActive = activeTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        id={`tab-${tab.key}`}
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`tabpanel-${tab.key}`}
                        onClick={() => setActiveTab(tab.key)}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-left transition-colors border-l-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-myBlue-200"
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
                    type="button"
                    onClick={() => setShowConfirm(true)}
                    disabled={deleting}
                    aria-label={t('settings.deleteAccount')}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-left transition-colors hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:opacity-50"
                    style={{ color: '#ED5B5B' }}
                  >
                    <span>
                      {deleting
                        ? t('common.loading')
                        : t('settings.deleteAccount')}
                    </span>
                  </button>
                  {deleteError && (
                    <p className="px-4 pb-3 text-xs text-red-500">
                      {deleteError}
                    </p>
                  )}
                </div>
              </nav>
            </aside>

            <main
              className="flex-1 min-w-0"
              aria-live="polite"
              aria-label={activeTabLabel}
            >
              {activeTab === 'personal' && (
                <section
                  id="tabpanel-personal"
                  role="tabpanel"
                  aria-labelledby="tab-personal"
                  tabIndex={0}
                  className="bg-white rounded-2xl shadow-md p-6 md:p-8 focus:outline-none"
                >
                  <PersonalTab
                    username={me.username}
                    email={me.email}
                    image={me.image}
                  />
                </section>
              )}
              {activeTab === 'security' && (
                <section
                  id="tabpanel-security"
                  role="tabpanel"
                  aria-labelledby="tab-security"
                  tabIndex={0}
                  className="bg-white rounded-2xl shadow-md p-6 md:p-8 focus:outline-none"
                >
                  <SecurityTab />
                </section>
              )}
              {activeTab === 'chef-profile' && (
                <section
                  id="tabpanel-chef-profile"
                  role="tabpanel"
                  aria-labelledby="tab-chef-profile"
                  tabIndex={0}
                  className="bg-white rounded-2xl shadow-md p-6 md:p-8 focus:outline-none"
                >
                  <ChefProfileTab />
                </section>
              )}
              {activeTab === 'nutritionist-profile' && (
                <section
                  id="tabpanel-nutritionist-profile"
                  role="tabpanel"
                  aria-labelledby="tab-nutritionist-profile"
                  tabIndex={0}
                  className="bg-white rounded-2xl shadow-md p-6 md:p-8 focus:outline-none"
                >
                  <NutritionistProfileTab />
                </section>
              )}
              {activeTab === 'meal-plan' && (
                <section
                  id="tabpanel-meal-plan"
                  role="tabpanel"
                  aria-labelledby="tab-meal-plan"
                  tabIndex={0}
                  className="bg-white rounded-2xl shadow-md p-6 md:p-8 focus:outline-none"
                >
                  <MealPlanTab />
                </section>
              )}
            </main>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)' }}
          onClick={() => !deleting && setShowConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-bold text-center  mb-2">
              {t('settings.deleteConfirmTitle')}
            </h2>
            <p className="text-sm text-center text-gray-500 mb-6 leading-relaxed">
              {t('settings.deleteConfirmMessage')}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="flex-1 py-2.5 text-sm font-semibold rounded-full border-2 transition-colors disabled:opacity-50"
                style={{ borderColor: '#D1D5DB', color: '#6B7280' }}
              >
                {t('settings.deleteConfirmCancel')}
              </button>
              <button
                onClick={async () => {
                  setShowConfirm(false);
                  await handleDeleteAccount();
                }}
                disabled={deleting}
                className="flex-1 py-2.5 text-sm font-semibold rounded-full text-white transition-colors hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: '#ED5B5B' }}
              >
                {deleting
                  ? t('common.loading')
                  : t('settings.deleteConfirmYes')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
