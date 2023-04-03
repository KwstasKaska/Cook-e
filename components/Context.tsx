import { createContext } from 'react';
import { Appointment } from './Nutritionist/CalendarC';

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
