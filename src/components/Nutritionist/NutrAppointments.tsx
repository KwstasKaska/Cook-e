import Image from 'next/image';
import { useTranslation } from 'next-i18next';

import coffee from '/public/images/coffee.jpg';
import MyAppointments from './Helper/MyAppointments';
import { useGetAppointmentRequestsForNutritionistQuery } from '../../generated/graphql';
import { useChatContext } from '../Chat/ChatContext';

interface NutrAppointmentsProps {}

const NutrAppointments: React.FC<NutrAppointmentsProps> = ({}) => {
  const { t } = useTranslation('common');
  const { openConversation } = useChatContext();

  const { data: requestsData } = useGetAppointmentRequestsForNutritionistQuery({
    variables: { limit: 100, offset: 0 },
    fetchPolicy: 'network-only',
  });

  const acceptedClients = Object.values(
    (requestsData?.getAppointmentRequestsForNutritionist ?? [])
      .filter((req) => req.status === 'ACCEPTED' && req.client)
      .reduce<Record<number, { id: number; username: string }>>((acc, req) => {
        const client = req.client!;
        if (!acc[client.id]) {
          acc[client.id] = { id: client.id, username: client.username };
        }
        return acc;
      }, {}),
  );

  return (
    <section
      id="section_3"
      className="flex min-h-screen w-full flex-col items-center bg-myGrey-200"
    >
      <h1 className="relative z-[2] pt-6 text-center text-2xl font-bold text-white hover:text-myRed md:text-4xl">
        {t('nutr.todayAppointments')}
      </h1>

      <div className="relative flex flex-1 items-center justify-center py-10">
        {/* Coffee image — hidden on mobile, shown lg+ */}
        <div className="hidden lg:block">
          <Image
            src={coffee}
            alt={t('nutr.coffeeImageAlt')}
            priority
            className="h-full max-w-[380px] py-10"
          />
        </div>

        {/* Phone mockup — always visible; negative margin pulls it over the image on lg+ */}
        <div className="relative z-10 lg:-ml-20">
          <MyAppointments
            customClassName={
              'relative w-[19em] rounded-[2em] pt-4 min-h-[30em] bg-white shadow-2xl px-4 xl:bg-myGrey-100 transition duration-500 border-4 border-black'
            }
            textColor="black"
            showAttrs={false}
            marginCustom={'py-20'}
            emptyAppointments="hidden"
          />
        </div>
      </div>

      {/* ── Message your patients ──────────────────────────────────────────── */}
      {acceptedClients.length > 0 && (
        <div className="mx-auto w-full max-w-xl px-6 pb-10">
          <h2 className="mb-4 text-center text-lg font-bold text-white">
            {t('nutr.messagePatients')}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {acceptedClients.map((client) => (
              <button
                key={client.id}
                onClick={() => openConversation(client.id)}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#377CC3' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10h.01M12 10h.01M16 10h.01M21 16c0 1.1-.9 2-2 2H7l-4 4V6a2 2 0 012-2h14a2 2 0 012 2v10z"
                  />
                </svg>
                {client.username}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default NutrAppointments;
