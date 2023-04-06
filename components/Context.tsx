import { createContext } from 'react';
import { Appointment } from './Nutritionist/CalendarC';
import { CellInfo } from './Nutritionist/NutrScheduler';

export const DateContext = createContext<{
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
}>({
  selectedDate: '',
  setSelectedDate: () => {},
});

export const ClientsContextType = createContext<{
  clients: Appointment[];
  setClients: React.Dispatch<React.SetStateAction<Appointment[]>>;
}>({
  clients: [],
  setClients: () => {},
});

export const TableContextType = createContext<{
  selectedDay: string;
  setSelectedDay: (day: string) => void;
  selectedField: string;
  setSelectedField: (field: string) => void;
  cellInfo: CellInfo;
  setCellInfo: (cellInfo: CellInfo) => void;
}>({
  selectedDay: '',
  setSelectedDay: () => {},
  selectedField: '',
  setSelectedField: () => {},
  cellInfo: {},
  setCellInfo: () => {},
});
