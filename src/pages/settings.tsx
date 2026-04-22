import { useState } from 'react';
import Navbar from '../components/Users/Navbar';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  useUpdateUserMutation,
  useUpdateChefProfileMutation,
  useUpdateNutritionistProfileMutation,
  useMyChefProfileQuery,
  useMyNutritionistProfileQuery,
} from '../generated/graphql';
import useIsAuth from '../utils/useIsAuth';

// ─── Types
type Role = 'CHEF' | 'USER' | 'NUTRITIONIST';

type TabKey =
  | 'personal'
  | 'security'
  | 'notifications'
  | 'chef-profile'
  | 'nutritionist-profile';

type Tab = {
  key: TabKey;
  labelKey: string;
  icon: string;
  roles: Role[];
};

const TABS: Tab[] = [
  {
    key: 'personal',
    labelKey: 'settings.personalInfo',
    icon: '👤',
    roles: ['USER', 'CHEF', 'NUTRITIONIST'],
  },
  {
    key: 'security',
    labelKey: 'settings.security',
    icon: '🔒',
    roles: ['USER', 'CHEF', 'NUTRITIONIST'],
  },
  {
    key: 'notifications',
    labelKey: 'settings.notifications',
    icon: '🔔',
    roles: ['USER', 'CHEF', 'NUTRITIONIST'],
  },
  {
    key: 'chef-profile',
    labelKey: 'settings.chefProfile',
    icon: '👨‍🍳',
    roles: ['CHEF'],
  },
  {
    key: 'nutritionist-profile',
    labelKey: 'settings.nutritionistProfile',
    icon: '🥗',
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

// ─── Shared sub-components

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
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  type?: string;
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  error?: string | null;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-xl border-2 px-4 py-2.5 text-sm focus:outline-none transition"
        style={{ borderColor: error ? '#ED5B5B' : '#EAEAEA', color: '#3F4756' }}
        onFocus={(e) => {
          if (!error) e.currentTarget.style.borderColor = '#377CC3';
        }}
        onBlur={(e) => {
          if (!error) e.currentTarget.style.borderColor = '#EAEAEA';
        }}
      />
      {error && (
        <p className="mt-1 text-xs" style={{ color: '#ED5B5B' }}>
          {error}
        </p>
      )}
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">
        {label}
      </label>
      <textarea
        rows={rows}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-xl border-2 px-4 py-2.5 text-sm resize-none focus:outline-none transition"
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

function SaveButton({
  onClick,
  loading,
}: {
  onClick?: () => void;
  loading?: boolean;
}) {
  const { t } = useTranslation('common');
  return (
    <div className="mt-8 flex justify-end">
      <button
        onClick={onClick}
        disabled={loading}
        className="px-8 py-2.5 rounded-full text-sm font-bold text-white transition hover:opacity-90 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#377CC3' }}
      >
        {loading ? '...' : t('settings.save')}
      </button>
    </div>
  );
}

function ServerError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="mt-3 text-sm text-center" style={{ color: '#ED5B5B' }}>
      {message}
    </p>
  );
}

function SuccessBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="mt-3 text-sm text-center" style={{ color: '#377CC3' }}>
      {message}
    </p>
  );
}

// ─── Tab panels

function PersonalTab({ username, email }: { username: string; email: string }) {
  const { t } = useTranslation('common');
  const [usernameVal, setUsernameVal] = useState(username);
  const [emailVal, setEmailVal] = useState(email);
  const [phoneVal, setPhoneVal] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updateUser, { loading }] = useUpdateUserMutation();

  const handleSave = async () => {
    setFieldErrors({});
    setServerError(null);
    setSuccess(null);

    if (!usernameVal.trim()) {
      setFieldErrors((p) => ({
        ...p,
        username: t('settings.usernameRequired'),
      }));
      return;
    }
    if (!emailVal.trim()) {
      setFieldErrors((p) => ({ ...p, email: t('settings.emailRequired') }));
      return;
    }

    try {
      const result = await updateUser({
        variables: {
          data: {
            username: usernameVal,
            email: emailVal,
            phoneNumber: phoneVal || undefined,
          },
        },
      });

      if (result.data?.updateUser.errors) {
        const errs: Record<string, string> = {};
        for (const e of result.data.updateUser.errors) {
          errs[e.field] = e.message;
        }
        setFieldErrors(errs);
        return;
      }

      setSuccess(t('settings.saveSuccess'));
    } catch {
      setServerError(t('settings.saveError'));
    }
  };

  return (
    <div>
      <FieldGroup title={t('settings.basicInfo')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label={t('settings.fullName')}
            value={usernameVal}
            onChange={setUsernameVal}
            error={fieldErrors.username}
          />
          <Field
            label="Email"
            type="email"
            value={emailVal}
            onChange={setEmailVal}
            error={fieldErrors.email}
          />
        </div>
        <Field
          label={t('settings.phone')}
          type="tel"
          value={phoneVal}
          onChange={setPhoneVal}
          placeholder="+30 210 0000000"
        />
      </FieldGroup>
      <ServerError message={serverError} />
      <SuccessBanner message={success} />
      <SaveButton onClick={handleSave} loading={loading} />
    </div>
  );
}

function SecurityTab() {
  const { t } = useTranslation('common');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updateUser, { loading }] = useUpdateUserMutation();

  const handleSave = async () => {
    setFieldErrors({});
    setServerError(null);
    setSuccess(null);

    if (!currentPassword) {
      setFieldErrors((p) => ({
        ...p,
        currentPassword: t('settings.currentPasswordRequired'),
      }));
      return;
    }
    if (!newPassword) {
      setFieldErrors((p) => ({
        ...p,
        newPassword: t('settings.newPasswordRequired'),
      }));
      return;
    }
    if (newPassword !== confirmPassword) {
      setFieldErrors((p) => ({
        ...p,
        confirmPassword: t('settings.passwordMismatch'),
      }));
      return;
    }

    try {
      const result = await updateUser({
        variables: { data: { currentPassword, newPassword } },
      });

      if (result.data?.updateUser.errors) {
        const errs: Record<string, string> = {};
        for (const e of result.data.updateUser.errors) {
          errs[e.field] = e.message;
        }
        setFieldErrors(errs);
        return;
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess(t('settings.saveSuccess'));
    } catch {
      setServerError(t('settings.saveError'));
    }
  };

  return (
    <div>
      <FieldGroup title={t('settings.changePassword')}>
        <Field
          label={t('settings.currentPassword')}
          type="password"
          value={currentPassword}
          onChange={setCurrentPassword}
          placeholder="••••••••"
          error={fieldErrors.currentPassword}
        />
        <Field
          label={t('settings.newPassword')}
          type="password"
          value={newPassword}
          onChange={setNewPassword}
          placeholder="••••••••"
          error={fieldErrors.newPassword}
        />
        <Field
          label={t('settings.confirmPassword')}
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="••••••••"
          error={fieldErrors.confirmPassword}
        />
      </FieldGroup>
      <ServerError message={serverError} />
      <SuccessBanner message={success} />
      <SaveButton onClick={handleSave} loading={loading} />
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
  const { data } = useMyChefProfileQuery();
  const [bio, setBio] = useState(data?.myChefProfile?.bio ?? '');
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updateChefProfile, { loading }] = useUpdateChefProfileMutation();

  const handleSave = async () => {
    setServerError(null);
    setSuccess(null);
    try {
      const result = await updateChefProfile({
        variables: { data: { bio } },
      });
      if (!result.data?.updateChefProfile) {
        setServerError(t('settings.saveError'));
        return;
      }
      setSuccess(t('settings.saveSuccess'));
    } catch {
      setServerError(t('settings.saveError'));
    }
  };

  return (
    <div>
      <FieldGroup title={t('settings.chefPublicProfile')}>
        <TextArea
          label={t('settings.chefBio')}
          value={bio}
          onChange={setBio}
          placeholder={t('settings.chefBioPlaceholder')}
        />
      </FieldGroup>
      <ServerError message={serverError} />
      <SuccessBanner message={success} />
      <SaveButton onClick={handleSave} loading={loading} />
    </div>
  );
}

function NutritionistProfileTab() {
  const { t } = useTranslation('common');
  const { data } = useMyNutritionistProfileQuery();
  const profile = data?.myNutritionistProfile;
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [city, setCity] = useState(profile?.city ?? '');
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updateNutritionistProfile, { loading }] =
    useUpdateNutritionistProfileMutation();

  const handleSave = async () => {
    setServerError(null);
    setSuccess(null);
    try {
      const result = await updateNutritionistProfile({
        variables: { data: { bio, phone, city } },
      });
      if (!result.data?.updateNutritionistProfile) {
        setServerError(t('settings.saveError'));
        return;
      }
      setSuccess(t('settings.saveSuccess'));
    } catch {
      setServerError(t('settings.saveError'));
    }
  };

  return (
    <div>
      <FieldGroup title={t('settings.professionalDetails')}>
        <TextArea
          label={t('settings.bio')}
          value={bio}
          onChange={setBio}
          placeholder={t('settings.bioPlaceholder')}
        />
        <Field
          label={t('settings.phone')}
          type="tel"
          value={phone}
          onChange={setPhone}
          placeholder="+30 210 0000000"
        />
        <Field
          label={t('settings.city')}
          value={city}
          onChange={setCity}
          placeholder="π.χ. Αθήνα"
        />
      </FieldGroup>
      <ServerError message={serverError} />
      <SuccessBanner message={success} />
      <SaveButton onClick={handleSave} loading={loading} />
    </div>
  );
}

// ─── Page — all hooks called unconditionally at the top

export default function SettingsPage() {
  const { t } = useTranslation('common');
  const { loading: authLoading, isAuthorized, me } = useIsAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('personal');

  // All hooks above this line — no early returns before hooks

  if (authLoading || !isAuthorized || !me) return null;

  const role = me.role as Role;
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
              {activeTab === 'personal' && (
                <PersonalTab username={me.username} email={me.email} />
              )}
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
