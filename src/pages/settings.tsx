import { useState } from 'react';
import Navbar from '../components/Users/Navbar';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// ─── Types
type Role = 'user' | 'chef' | 'nutritionist';

type TabKey =
  | 'personal'
  | 'security'
  | 'notifications'
  | 'payments'
  | 'chef-profile'
  | 'nutritionist-profile';

type Tab = {
  key: TabKey;
  labelKey: string;
  icon: string;
  roles: Role[];
};

// Fake data
const FAKE_USER = {
  name: 'Κωνσταντίνος Κασκαντίρης',
  email: 'kostas@example.com',
  phone: '+30 210 0000000',
  city: 'Αθήνα',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  role: 'chef' as Role,
};

const TABS: Tab[] = [
  {
    key: 'personal',
    labelKey: 'settings.personalInfo',
    icon: '👤',
    roles: ['user', 'chef', 'nutritionist'],
  },
  {
    key: 'security',
    labelKey: 'settings.security',
    icon: '🔒',
    roles: ['user', 'chef', 'nutritionist'],
  },
  {
    key: 'notifications',
    labelKey: 'settings.notifications',
    icon: '🔔',
    roles: ['user', 'chef', 'nutritionist'],
  },
  {
    key: 'chef-profile',
    labelKey: 'settings.chefProfile',
    icon: '👨‍🍳',
    roles: ['chef'],
  },
  {
    key: 'nutritionist-profile',
    labelKey: 'settings.nutritionistProfile',
    icon: '🥗',
    roles: ['nutritionist'],
  },
];

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

// ─── Shared components
function FieldGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <h3
        className="text-sm font-bold uppercase tracking-widest mb-4"
        style={{ color: '#377CC3' }}
      >
        {title}
      </h3>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  type = 'text',
  defaultValue,
  placeholder,
}: {
  label: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">
        {label}
      </label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-xl border-2 px-4 py-2.5 text-sm focus:outline-none transition"
        style={{ borderColor: '#EAEAEA', color: '#3F4756' }}
        onFocus={(e) => (e.currentTarget.style.borderColor = '#377CC3')}
        onBlur={(e) => (e.currentTarget.style.borderColor = '#EAEAEA')}
      />
    </div>
  );
}

function Toggle({
  label,
  description,
  defaultChecked = false,
}: {
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div
      className="flex items-center justify-between gap-4 py-3 border-b last:border-0"
      style={{ borderColor: '#EAEAEA' }}
    >
      <div>
        <p className="text-sm font-semibold" style={{ color: '#3F4756' }}>
          {label}
        </p>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        className="relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200"
        style={{ backgroundColor: on ? '#377CC3' : '#EAEAEA' }}
      >
        <span
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
          style={{ left: on ? '1.375rem' : '0.25rem' }}
        />
      </button>
    </div>
  );
}

function SaveButton({ onClick }: { onClick?: () => void }) {
  const { t } = useTranslation('common');
  return (
    <div className="mt-8 flex justify-end">
      <button
        onClick={onClick}
        className="px-8 py-2.5 rounded-full text-sm font-bold text-white transition hover:opacity-90 hover:scale-105"
        style={{ backgroundColor: '#377CC3' }}
      >
        {t('settings.save')}
      </button>
    </div>
  );
}

// ─── Tab panels
function PersonalTab({ user }: { user: typeof FAKE_USER }) {
  const { t } = useTranslation('common');

  return (
    <div>
      <div
        className="flex items-center gap-5 mb-8 pb-8 border-b"
        style={{ borderColor: '#EAEAEA' }}
      >
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
          />
          <button
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center text-white shadow"
            style={{ backgroundColor: '#377CC3' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z"
              />
            </svg>
          </button>
        </div>
        <div>
          <p className="font-bold text-lg" style={{ color: '#3F4756' }}>
            {user.name}
          </p>
          <p className="text-sm text-gray-400">{user.email}</p>
          <span
            className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: '#B3D5F8', color: '#3F4756' }}
          >
            {user.role === 'chef'
              ? 'Chef'
              : user.role === 'nutritionist'
                ? 'Διατροφολόγος'
                : 'Χρήστης'}
          </span>
        </div>
      </div>

      <FieldGroup title={t('settings.basicInfo')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={t('settings.fullName')} defaultValue={user.name} />
          <Field label="Email" type="email" defaultValue={user.email} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label={t('settings.phone')}
            type="tel"
            defaultValue={user.phone}
          />
          <Field label={t('settings.city')} defaultValue={user.city} />
        </div>
      </FieldGroup>

      <FieldGroup title={t('settings.aboutMe')}>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            {t('settings.bio')}
          </label>
          <textarea
            rows={4}
            placeholder={t('settings.bioPlaceholder')}
            className="w-full rounded-xl border-2 px-4 py-2.5 text-sm resize-none focus:outline-none transition"
            style={{ borderColor: '#EAEAEA', color: '#3F4756' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#377CC3')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#EAEAEA')}
          />
        </div>
      </FieldGroup>

      <SaveButton />
    </div>
  );
}

function SecurityTab() {
  const { t } = useTranslation('common');

  return (
    <div>
      <FieldGroup title={t('settings.changePassword')}>
        <Field
          label={t('settings.currentPassword')}
          type="password"
          placeholder="••••••••"
        />
        <Field
          label={t('settings.newPassword')}
          type="password"
          placeholder="••••••••"
        />
        <Field
          label={t('settings.confirmPassword')}
          type="password"
          placeholder="••••••••"
        />
      </FieldGroup>
      <SaveButton />
    </div>
  );
}

function NotificationsTab() {
  const { t } = useTranslation('common');

  return (
    <div>
      <FieldGroup title={t('settings.emailNotifications')}>
        <Toggle
          label={t('settings.newRecipes')}
          description={t('settings.newRecipesDesc')}
          defaultChecked
        />
        <Toggle
          label={t('settings.appointmentReminders')}
          description={t('settings.appointmentRemindersDesc')}
          defaultChecked
        />
      </FieldGroup>
      <SaveButton />
    </div>
  );
}

function ChefProfileTab() {
  const { t } = useTranslation('common');

  return (
    <div>
      <FieldGroup title={t('settings.chefPublicProfile')}>
        <Field
          label={t('settings.professionalTitle')}
          placeholder={t('settings.professionalTitlePlaceholder')}
        />
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            {t('settings.chefBio')}
          </label>
          <textarea
            rows={4}
            placeholder={t('settings.chefBioPlaceholder')}
            className="w-full rounded-xl border-2 px-4 py-2.5 text-sm resize-none focus:outline-none transition"
            style={{ borderColor: '#EAEAEA', color: '#3F4756' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#377CC3')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#EAEAEA')}
          />
        </div>
      </FieldGroup>

      <FieldGroup title={t('settings.socialMedia')}>
        <Field label={t('settings.website')} placeholder="https://..." />
      </FieldGroup>

      <SaveButton />
    </div>
  );
}

function NutritionistProfileTab() {
  const { t } = useTranslation('common');

  return (
    <div>
      <FieldGroup title={t('settings.professionalDetails')}>
        <Field
          label={t('settings.degreeTitle')}
          placeholder="π.χ. MSc Κλινική Διατροφολογία"
        />
        <Field label={t('settings.licenseNumber')} placeholder="π.χ. 12345" />
        <Field
          label={t('settings.specialization')}
          placeholder="π.χ. Αθλητική διατροφή"
        />
      </FieldGroup>
      <SaveButton />
    </div>
  );
}

// ─── Page
export default function SettingsPage() {
  const { t } = useTranslation('common');
  const role = FAKE_USER.role;
  const visibleTabs = TABS.filter((tab) => tab.roles.includes(role));
  const [activeTab, setActiveTab] = useState<TabKey>('personal');

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
                      <span className="text-base">{tab.icon}</span>
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
              {activeTab === 'personal' && <PersonalTab user={FAKE_USER} />}
              {activeTab === 'security' && <SecurityTab />}
              {activeTab === 'notifications' && <NotificationsTab />}
              {activeTab === 'chef-profile' && <ChefProfileTab />}
              {activeTab === 'nutritionist-profile' && (
                <NutritionistProfileTab />
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
