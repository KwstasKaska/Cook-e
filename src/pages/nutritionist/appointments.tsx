import { useState, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { el, enUS } from 'date-fns/locale';
import useIsNutritionist from '../../utils/useIsNutr';
import NutrNavbar from '../../components/Nutritionist/NutrNavbar';
import {
  useGetMyAppointmentsQuery,
  useGetAppointmentRequestsForNutritionistQuery,
  useCreateAppointmentMutation,
  useDeleteAppointmentMutation,
  useRespondToAppointmentRequestMutation,
  AppointmentStatus,
} from '../../generated/graphql';
import { toDisplay } from '../../utils/appointmentUtils';

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function AppointmentsPage() {
  const { loading: authLoading, isAuthorized } = useIsNutritionist();
  if (authLoading || !isAuthorized) return null;
  return <AppointmentsContent />;
}

const AppointmentsContent = () => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const dateFnsLocale = i18n.language === 'el' ? el : enUS;

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [slotError, setSlotError] = useState('');

  const { data: slotsData, refetch: refetchSlots } = useGetMyAppointmentsQuery({
    fetchPolicy: 'network-only',
  });

  const { data: requestsData, refetch: refetchRequests } =
    useGetAppointmentRequestsForNutritionistQuery({
      variables: { limit: 100, offset: 0 },
      fetchPolicy: 'network-only',
    });

  const [createAppointment] = useCreateAppointmentMutation();
  const [deleteAppointment] = useDeleteAppointmentMutation();
  const [respondToAppointmentRequest] =
    useRespondToAppointmentRequestMutation();

  const today = new Date().toISOString().slice(0, 10);

  const futureSlots = useMemo(() => {
    return (slotsData?.getMyAppointments ?? [])
      .filter((s) => s.date >= today)
      .sort((a, b) => {
        const d = a.date.localeCompare(b.date);
        if (d !== 0) return d;
        return (a.time ?? '').localeCompare(b.time ?? '');
      });
  }, [slotsData, today]);

  const pendingRequests = useMemo(() => {
    return (requestsData?.getAppointmentRequestsForNutritionist ?? []).filter(
      (r) =>
        r.status === AppointmentStatus.Pending &&
        r.slot?.date &&
        r.slot.date >= today,
    );
  }, [requestsData, today]);

  const handleCreateSlot = async () => {
    setSlotError('');
    if (!date) {
      setSlotError(t('nutr.selectDateFirst'));
      return;
    }
    if (!time) {
      setSlotError(t('nutr.selectTimeFirst'));
      return;
    }

    const result = await createAppointment({
      variables: { data: { date, time } },
    });
    const errors = result.data?.createAppointment?.errors;
    if (errors?.length) {
      setSlotError(errors[0].message);
      return;
    }

    setDate('');
    setTime('');
    await refetchSlots();
  };

  const handleDelete = async (slotId: number) => {
    await deleteAppointment({ variables: { slotId } });
    await refetchSlots();
  };

  const handleRespond = async (
    requestId: number,
    status: AppointmentStatus,
  ) => {
    await respondToAppointmentRequest({ variables: { requestId, status } });
    await refetchRequests();
  };

  return (
    <div className="min-h-screen">
      <NutrNavbar />
      <div className="mx-auto max-w-3xl lg:max-w-4xl px-6 pb-16 pt-10">
        <button
          onClick={() => router.back()}
          className="mb-6 text-myText-muted "
        >
          {t('common.back')}
        </button>
        <section className="mb-12">
          <div className="mb-8 text-center">
            <h1>{t('nutrnav.appointments')}</h1>
          </div>
          <h2 className="mb-4 text-center">{t('nutr.pendingRequests2')}</h2>

          {pendingRequests.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-myText-muted">
                {t('nutr.noPendingRequests2')}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {pendingRequests.map((req) => {
                const client = req.client;
                const reqDate = req.slot?.date
                  ? toDisplay(req.slot.date, dateFnsLocale)
                  : '—';
                const reqTime = req.slot?.time ?? '—';

                return (
                  <div
                    key={req.id}
                    className="flex flex-col gap-3 overflow-hidden rounded-2xl border-2 border-cookie-400  bg-surface px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {client?.image ? (
                        <img
                          src={client.image}
                          alt={client.username}
                          className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-cookie-400 object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-cookie-200" />
                      )}
                      <div className="min-w-0">
                        <p className="truncate">{client?.username ?? '—'}</p>
                        <p className="truncate text-myText-muted">
                          {reqDate} · {reqTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-shrink-0 gap-2">
                      <button
                        onClick={() =>
                          handleRespond(req.id, AppointmentStatus.Accepted)
                        }
                        className="rounded-full border-2 border-cookie-400 px-4 py-1 hover:bg-cookie-400 hover:text-white transition hover:opacity-80"
                      >
                        {t('nutr.accept')}
                      </button>
                      <button
                        onClick={() =>
                          handleRespond(req.id, AppointmentStatus.Rejected)
                        }
                        className="rounded-full border-2 border-myRed px-4 py-1 text-myRed transition hover:bg-myRed hover:text-white"
                      >
                        {t('nutr.reject')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="mb-10 border-t border-cookie-200" />

        <section className="mb-12">
          <h2 className="mb-4 text-center">{t('nutr.createSlot')}</h2>

          <div className="flex flex-col gap-3 rounded-2xl border-2 border-cookie-400 bg-surface p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="date"
                value={date}
                min={today}
                onChange={(e) => {
                  setDate(e.target.value);
                  setSlotError('');
                }}
                className="rounded-full border-2 border-cookie-400 bg-surface px-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-cookie-300"
              />
              <input
                type="time"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  setSlotError('');
                }}
                className="rounded-full border-2 border-cookie-400 bg-surface px-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-cookie-300"
              />
              <button
                onClick={handleCreateSlot}
                className="rounded-full bg-cookie-300 px-5 py-1.5 text-white transition hover:bg-cookie-400"
              >
                {t('nutr.register')}
              </button>
            </div>
            {slotError && <p className="text-myRed">{slotError}</p>}
          </div>

          {futureSlots.length > 0 && (
            <div className="mt-4 flex flex-col gap-2">
              {futureSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between rounded-2xl border border-cookie-200 bg-surface px-4 py-3"
                >
                  <div className="flex gap-3">
                    <span>{toDisplay(slot.date, dateFnsLocale)}</span>
                    <span className="text-myText-muted">{slot.time}</span>
                  </div>
                  {slot.isAvailable && (
                    <button
                      onClick={() => handleDelete(slot.id)}
                      className="text-myText-muted transition hover:text-myRed"
                      aria-label="Delete slot"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
