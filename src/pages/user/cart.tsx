import React, { useState } from 'react';
import Navbar from '../../components/Users/Navbar';

import ScrollToTopButton from '../../components/Helper/ScrollToTopButton';

interface CartItem {
  id: number;
  name: string;
  emoji: string;
  weightGrams: number;
  checked: boolean;
}

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
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-white py-14">
        <div className="container mx-auto max-w-2xl">
          <h2 className="mb-2 text-center text-2xl font-bold text-myGrey-200 md:text-3xl xl:text-4xl">
            Το Καλάθι Μου
          </h2>
          <p className="mb-8 text-center text-xs text-gray-400 md:text-sm">
            Λίστα αγορών για το σούπερ μάρκετ. Επιλέξτε αυτά που έχετε ήδη.
          </p>

          {/* Add item */}
          <div className="mb-6 flex gap-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
              placeholder="Προσθήκη υλικού..."
              className="flex-1 rounded-xl border-2 border-myGrey-100 px-4 py-2 text-sm text-myGrey-200 placeholder-gray-400 focus:border-myBlue-200 focus:outline-none md:text-base"
            />
            <button
              onClick={addItem}
              className="rounded-xl bg-myBlue-200 px-4 py-2 text-sm font-bold text-white transition hover:scale-105 hover:bg-myBlue-100"
            >
              +
            </button>
          </div>

          {items.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-myGrey-100 p-10 text-center">
              <p className="text-myGrey-200">Το καλάθι σου είναι άδειο.</p>
            </div>
          ) : (
            <>
              {/* 2-column grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 rounded-2xl border-2 px-3 py-3 transition ${
                      item.checked
                        ? 'border-myBlue-100 bg-myBlue-100 bg-opacity-20'
                        : 'border-myGrey-100'
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggle(item.id)}
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition ${
                        item.checked
                          ? 'border-myBlue-200 bg-myBlue-200'
                          : 'border-myGrey-200 bg-transparent'
                      }`}
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
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-myGrey-100 text-xl">
                      {item.emoji}
                    </div>

                    {/* Name + weight */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`truncate text-sm font-bold md:text-base ${
                          item.checked
                            ? 'text-gray-400 line-through'
                            : 'text-myGrey-200'
                        }`}
                      >
                        {item.name}
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        <button
                          onClick={() => dec(item.id)}
                          className="flex h-5 w-5 items-center justify-center rounded-full bg-myGrey-100 text-xs font-bold text-myGrey-200 hover:bg-myRed hover:text-white transition"
                        >
                          −
                        </button>
                        <span className="min-w-[3.5em] text-center text-xs text-gray-500">
                          {item.weightGrams}g
                        </span>
                        <button
                          onClick={() => inc(item.id)}
                          className="flex h-5 w-5 items-center justify-center rounded-full bg-myGrey-100 text-xs font-bold text-myGrey-200 hover:bg-myBlue-200 hover:text-white transition"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => remove(item.id)}
                      className="flex-shrink-0 text-gray-300 hover:text-myRed transition"
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
              <div className="mt-6 flex items-center justify-between border-t-2 border-myGrey-100 pt-5">
                <p className="text-sm text-gray-400">
                  {checkedCount}/{items.length} αντικείμενα
                </p>
                <button
                  onClick={clearChecked}
                  disabled={checkedCount === 0}
                  className={`rounded-full border-2 px-5 py-2 text-sm font-bold transition ${
                    checkedCount > 0
                      ? 'border-myRed text-myRed hover:bg-myRed hover:text-white'
                      : 'border-myGrey-100 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  Καθαρισμός επιλεγμένων
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <ScrollToTopButton />
    </div>
  );
}
