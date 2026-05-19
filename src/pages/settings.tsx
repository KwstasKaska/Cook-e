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
import ChefNavbar from '../components/Chef/ChefNavbar';
import NutrNavbar from '../components/Nutritionist/NutrNavbar';
import { useDeleteUserMutation } from '../generated/graphql';
import { useApolloClient } from '@apollo/client';
import DeleteConfirm from '../components/Helper/DeleteConfirm';

type Role = 'CHEF' | 'USER' | 'NUTRITIONIST';

type TabKey =
  | 'personal'
  | 'security'
  | 'chef-profile'
  | 'nutritionist-profile'
  | 'meal-plan'
  | 'appointments';

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
  { key: 'chef-profile', labelKey: 'settings.chefProfile', roles: ['CHEF'] },
  {
    key: 'nutritionist-profile',
    labelKey: 'settings.nutritionistProfile',
    roles: ['NUTRITIONIST'],
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
    const result = await deleteUser();
    if (!result.data?.deleteUser) {
      setDeleteError(t('settings.deleteError'));
      return;
    }
    await apolloClient.clearStore();
    router.push('/');
  };

  if (authLoading || !isAuthorized || !me) return null;

  const role = me.role.toUpperCase() as Role;
  const visibleTabs = TABS.filter((tab) => tab.roles.includes(role));

  const renderNavbar = () => {
    if (role === 'CHEF') return <ChefNavbar />;
    if (role === 'NUTRITIONIST') return <NutrNavbar />;
    return <Navbar />;
  };

  return (
    <div className="min-h-screen ">
      {renderNavbar()}

      {showConfirm && (
        <DeleteConfirm
          title={t('settings.deleteConfirmTitle')}
          confirmLabel={t('settings.deleteConfirmYes')}
          cancelLabel={t('settings.deleteConfirmCancel')}
          loading={deleting}
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div className="relative overflow-hidden min-h-screen">
        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-10 pb-20">
          <button
            onClick={() => router.back()}
            className="mb-6 text-myText-muted "
          >
            {t('common.back')}
          </button>
          <h1 className="mb-8">{t('settings.title')}</h1>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <aside className="w-full md:w-56 flex-shrink-0">
              <nav>
                <div
                  role="tablist"
                  className="bg-surface rounded-2xl  border border-cookie-200 overflow-hidden"
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
                        className="w-full flex items-center gap-3 px-4 py-3.5   text-left transition-colors border-l-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-cookie-300"
                        style={{
                          borderLeftColor: isActive ? '#C9955A' : 'transparent',
                          backgroundColor: isActive ? '#F7EDE0' : 'transparent',
                          color: isActive ? '#A0652A' : '#3D3529',
                        }}
                      >
                        <span>{t(tab.labelKey)}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 bg-surface rounded-2xl  border border-cookie-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowConfirm(true)}
                    disabled={deleting}
                    className="w-full flex items-center gap-3 px-4 py-3.5   text-left transition-colors text-myRed hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-myRed disabled:opacity-50"
                  >
                    <span>{!deleting && t('settings.deleteAccount')}</span>
                  </button>
                  {deleteError && (
                    <p className="px-4 pb-3  text-myRed">{deleteError}</p>
                  )}
                </div>
              </nav>
            </aside>

            <main className="flex-1 min-w-0">
              {activeTab === 'personal' && (
                <section
                  id="tabpanel-personal"
                  role="tabpanel"
                  tabIndex={0}
                  className="bg-surface rounded-2xl  border border-cookie-200 p-6 md:p-8 focus:outline-none"
                >
                  <PersonalTab username={me.username} image={me.image} />
                </section>
              )}
              {activeTab === 'security' && (
                <section
                  id="tabpanel-security"
                  role="tabpanel"
                  tabIndex={0}
                  className="bg-surface rounded-2xl  border border-cookie-200 p-6 md:p-8 focus:outline-none"
                >
                  <SecurityTab />
                </section>
              )}
              {activeTab === 'chef-profile' && (
                <section
                  id="tabpanel-chef-profile"
                  role="tabpanel"
                  tabIndex={0}
                  className="bg-surface rounded-2xl  border border-cookie-200 p-6 md:p-8 focus:outline-none"
                >
                  <ChefProfileTab />
                </section>
              )}
              {activeTab === 'nutritionist-profile' && (
                <section
                  id="tabpanel-nutritionist-profile"
                  role="tabpanel"
                  tabIndex={0}
                  className="bg-surface rounded-2xl  border border-cookie-200 p-6 md:p-8 focus:outline-none"
                >
                  <NutritionistProfileTab />
                </section>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
