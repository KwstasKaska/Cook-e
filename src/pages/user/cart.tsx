import React, { useState } from 'react';
import ScrollToTopButton from '../../components/Helper/ScrollToTopButton';
import Navbar from '../../components/Users/Navbar';

// ── Type
type CartItem = {
  id: number;
  name: string;
  emoji: string;
  weightGrams: number;
  checked: boolean;
};

// ── Fake data
const INITIAL_ITEMS: CartItem[] = [
  { id: 1, name: 'Τομάτες', emoji: '🍅', weightGrams: 300, checked: true },
  { id: 2, name: 'Κρεμμύδια', emoji: '🧅', weightGrams: 150, checked: false },
  { id: 3, name: 'Πατάτες', emoji: '🥔', weightGrams: 500, checked: true },
  { id: 4, name: 'Μπέικον', emoji: '🥓', weightGrams: 200, checked: true },
  { id: 5, name: 'Παπρίκα', emoji: '🌶️', weightGrams: 100, checked: false },
  { id: 6, name: 'Τυρί', emoji: '🧀', weightGrams: 200, checked: false },
];

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS);
  const [newItem, setNewItem] = useState('');

  const toggle = (id: number) =>
    setItems((p) =>
      p.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)),
    );

  const inc = (id: number) =>
    setItems((p) =>
      p.map((i) =>
        i.id === id ? { ...i, weightGrams: i.weightGrams + 50 } : i,
      ),
    );

  const dec = (id: number) =>
    setItems((p) =>
      p.map((i) =>
        i.id === id
          ? { ...i, weightGrams: Math.max(50, i.weightGrams - 50) }
          : i,
      ),
    );

  const remove = (id: number) => setItems((p) => p.filter((i) => i.id !== id));

  const addItem = () => {
    if (!newItem.trim()) return;
    setItems((p) => [
      ...p,
      {
        id: Date.now(),
        name: newItem.trim(),
        emoji: '🛒',
        weightGrams: 100,
        checked: false,
      },
    ]);
    setNewItem('');
  };

  const clearChecked = () => setItems((p) => p.filter((i) => !i.checked));

  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#3F4756' }}>
      <Navbar />

      <div className="relative overflow-hidden min-h-screen">
        <div
          className="absolute bottom-0 left-0 w-full bg-white"
          style={{
            height: '80%',
            clipPath: 'polygon(0 12%, 100% 0%, 100% 100%, 0% 100%)',
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto px-6 pt-14 pb-20">
          {/* Heading */}
          <h2 className="text-white text-3xl md:text-4xl font-bold text-center mb-1">
            Το Καλάθι Μου
          </h2>
          <p className="text-gray-300 text-sm text-center mb-10">
            Λίστα αγορών για το σούπερ μάρκετ. Επιλέξτε αυτά που έχετε ήδη.
          </p>

          {/* Add item */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
              placeholder="Προσθήκη υλικού..."
              className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-myBlue-200 focus:outline-none"
            />
            <button
              onClick={addItem}
              className="rounded-xl px-4 py-2 text-sm font-bold text-white transition hover:scale-105"
              style={{ backgroundColor: '#377CC3' }}
            >
              +
            </button>
          </div>

          {items.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center bg-white">
              <p className="text-gray-500">Το καλάθι σου είναι άδειο.</p>
            </div>
          ) : (
            <>
              {/* 2-column grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-2xl border-2 px-3 py-3 bg-white transition"
                    style={{
                      borderColor: item.checked ? '#B3D5F8' : '#EAEAEA',
                      backgroundColor: item.checked
                        ? 'rgba(179,213,248,0.15)'
                        : 'white',
                    }}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggle(item.id)}
                      className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition"
                      style={{
                        borderColor: item.checked ? '#377CC3' : '#3F4756',
                        backgroundColor: item.checked
                          ? '#377CC3'
                          : 'transparent',
                      }}
                    >
                      {item.checked && (
                        <svg
                          viewBox="0 0 16 16"
                          fill="none"
                          className="h-3 w-3"
                        >
                          <path
                            d="M3 8l3.5 3.5L13 4"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>

                    {/* Emoji */}
                    <div
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xl"
                      style={{ backgroundColor: '#EAEAEA' }}
                    >
                      {item.emoji}
                    </div>

                    {/* Name + weight */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="truncate text-sm font-bold md:text-base"
                        style={{
                          color: item.checked ? '#9CA3AF' : '#3F4756',
                          textDecoration: item.checked
                            ? 'line-through'
                            : 'none',
                        }}
                      >
                        {item.name}
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        <button
                          onClick={() => dec(item.id)}
                          className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold transition hover:text-white"
                          style={{
                            backgroundColor: '#EAEAEA',
                            color: '#3F4756',
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = '#ED5B5B')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = '#EAEAEA')
                          }
                        >
                          −
                        </button>
                        <span className="min-w-[3.5em] text-center text-xs text-gray-500">
                          {item.weightGrams}g
                        </span>
                        <button
                          onClick={() => inc(item.id)}
                          className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold transition hover:text-white"
                          style={{
                            backgroundColor: '#EAEAEA',
                            color: '#3F4756',
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = '#377CC3')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = '#EAEAEA')
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => remove(item.id)}
                      className="flex-shrink-0 text-gray-300 transition hover:text-red-400"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div
                className="mt-6 flex items-center justify-between border-t-2 pt-5"
                style={{ borderColor: '#EAEAEA' }}
              >
                <p className="text-sm text-gray-400">
                  {checkedCount}/{items.length} αντικείμενα
                </p>
                <button
                  onClick={clearChecked}
                  disabled={checkedCount === 0}
                  className="rounded-full border-2 px-5 py-2 text-sm font-bold transition"
                  style={{
                    borderColor: checkedCount > 0 ? '#ED5B5B' : '#EAEAEA',
                    color: checkedCount > 0 ? '#ED5B5B' : '#9CA3AF',
                    cursor: checkedCount > 0 ? 'pointer' : 'not-allowed',
                  }}
                  onMouseEnter={(e) => {
                    if (checkedCount > 0) {
                      e.currentTarget.style.backgroundColor = '#ED5B5B';
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color =
                      checkedCount > 0 ? '#ED5B5B' : '#9CA3AF';
                  }}
                >
                  Καθαρισμός επιλεγμένων
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
}
