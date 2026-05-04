import { createContext } from 'react';

export const DateContext = createContext<{
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
}>({
  selectedDate: '',
  setSelectedDate: () => {},
});
