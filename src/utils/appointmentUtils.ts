import { format } from 'date-fns';
import { AppointmentStatus } from '../generated/graphql';

export const statusStyle: Record<AppointmentStatus, string> = {
  [AppointmentStatus.Accepted]: 'bg-herb-100 text-herb-200',
  [AppointmentStatus.Pending]: 'bg-cookie-100 text-cookie-400',
  [AppointmentStatus.Rejected]: 'bg-red-100 text-myRed',
};

export const toDisplay = (isoDate: string, locale: Locale): string => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return format(new Date(year, month - 1, day), 'dd MMMM yyyy', { locale });
};
