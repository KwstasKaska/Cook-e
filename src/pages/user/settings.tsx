import React, { useState } from 'react';
import Navbar from '../../components/Users/Navbar';

type SettingsTab =
  | 'personal'
  | 'notifications'
  | 'general'
  | 'payment'
  | 'app'
  | 'identity'
  | 'allergies'
  | 'diet';

const TABS: { key: SettingsTab; label: string }[] = [
  { key: 'personal', label: 'Προσωπικά Στοιχεία' },
  { key: 'notifications', label: 'Ειδοποιήσεις' },
  { key: 'general', label: 'Γενικές Ρυθμίσεις' },
  { key: 'payment', label: 'Πληροφορίες Πληρωμής' },
  { key: 'app', label: 'Πληροφορίες Εφαρμογής' },
  { key: 'identity', label: 'Ταυτοποίηση' },
  { key: 'allergies', label: 'Αλλεργίες και Ιατρικές Παθήσεις' },
  { key: 'diet', label: 'Διατροφικές Συνήθειες' },
];

// Personal info panel
const PersonalInfo = () => {
  const [username, setUsername] = useState('Κώνσταντίνος Κασκαντίρης');
  const [email, setEmail] = useState('kwstas@kwstas.com');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-myGrey-200 md:text-2xl">
          Προσωπικά Στοιχεία
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Ανανεώστε την εικόνα προφίλ σας και τα προσωπικά σας στοιχεία
        </p>
      </div>

      {/* Avatar upload */}
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-myBlue-200 text-3xl font-bold text-white">
          Κ
        </div>
        <button className="rounded-full border-2 border-myBlue-200 px-4 py-2 text-sm font-bold text-myBlue-200 transition hover:bg-myBlue-200 hover:text-white">
          Αλλαγή φωτογραφίας
        </button>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-bold text-myGrey-200">
            Όνομα Χρήστη
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border-2 border-myGrey-100 px-4 py-2 text-sm text-myGrey-200 focus:border-myBlue-200 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold text-myGrey-200">
            Κωδικός
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Τρέχων κωδικός"
            className="w-full rounded-xl border-2 border-myGrey-100 px-4 py-2 text-sm text-myGrey-200 focus:border-myBlue-200 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold text-myGrey-200">
            Νέος Κωδικός
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Νέος κωδικός"
            className="w-full rounded-xl border-2 border-myGrey-100 px-4 py-2 text-sm text-myGrey-200 focus:border-myBlue-200 focus:outline-none"
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-bold text-myGrey-200">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border-2 border-myGrey-100 px-4 py-2 text-sm text-myGrey-200 focus:border-myBlue-200 focus:outline-none"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className={`w-fit rounded-full px-8 py-2 text-sm font-bold transition ${
          saved
            ? 'bg-green-500 text-white'
            : 'bg-myBlue-200 text-white hover:scale-105 hover:bg-myBlue-100'
        }`}
      >
        {saved ? 'Αποθηκεύτηκε!' : 'Αποθήκευση'}
      </button>
    </div>
  );
};

// Placeholder for other tabs
const PlaceholderPanel = ({ label }: { label: string }) => (
  <div className="flex flex-col gap-4">
    <h2 className="text-xl font-bold text-myGrey-200 md:text-2xl">{label}</h2>
    <div className="rounded-2xl border-2 border-dashed border-myGrey-100 p-10 text-center">
      <p className="text-sm text-gray-400">Σύντομα διαθέσιμο.</p>
    </div>
  </div>
);

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('personal');
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeLabel = TABS.find((t) => t.key === activeTab)?.label ?? '';

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-myGrey-100 py-14">
        <div className="container mx-auto max-w-5xl">
          <h1 className="mb-8 text-2xl font-bold text-myGrey-200 md:text-3xl">
            Ρυθμίσεις
          </h1>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
            {/* Sidebar */}
            <div className="rounded-2xl bg-white p-4 shadow-3xl">
              {/* Mobile: show/hide */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="mb-2 flex w-full items-center justify-between md:hidden"
              >
                <span className="text-sm font-bold text-myBlue-200">
                  {activeLabel}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`h-5 w-5 text-myGrey-200 transition ${
                    mobileOpen ? 'rotate-180' : ''
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <ul
                className={`flex flex-col gap-1 ${
                  mobileOpen ? 'block' : 'hidden md:flex'
                }`}
              >
                {TABS.map((tab) => (
                  <li key={tab.key}>
                    <button
                      onClick={() => {
                        setActiveTab(tab.key);
                        setMobileOpen(false);
                      }}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition md:text-base ${
                        activeTab === tab.key
                          ? 'bg-myBlue-100 font-bold text-myBlue-200'
                          : 'text-myGrey-200 hover:bg-myGrey-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Content panel */}
            <div className="rounded-2xl bg-white p-6 shadow-3xl">
              {activeTab === 'personal' && <PersonalInfo />}
              {activeTab !== 'personal' && (
                <PlaceholderPanel label={activeLabel} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
