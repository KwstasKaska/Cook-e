import { createContext } from 'react';
import { CellInfo } from './Nutritionist/NutrScheduler';

export const DateContext = createContext<{
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
}>({
  selectedDate: '',
  setSelectedDate: () => {},
});

export const TableContextType = createContext<{
  selectedDay: string;
  setSelectedDay: (day: string) => void;
  selectedField: string;
  setSelectedField: (field: string) => void;
  cellInfo: CellInfo;
  setCellInfo: (cellInfo: CellInfo) => void;
  selectedUserId: number | null;
  setSelectedUserId: (id: number | null) => void;
}>({
  selectedDay: '',
  setSelectedDay: () => {},
  selectedField: '',
  setSelectedField: () => {},
  cellInfo: {},
  setCellInfo: () => {},
  selectedUserId: null,
  setSelectedUserId: () => {},
});
