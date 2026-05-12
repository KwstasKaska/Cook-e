import React, { useEffect, useState } from 'react';
import NutrNavbar from '../components/Nutritionist/NutrNavbar';
import CalendarC from '../components/Nutritionist/CalendarC';
import NutrAppointments from '../components/Nutritionist/NutrAppointments';
import { DateContext } from '../components/Context';
import NutrScheduler from '../components/Nutritionist/NutrScheduler';
import { GetServerSidePropsContext, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import useIsNutritionist from '../utils/useIsNutr';

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common'])),
    },
  };
};

const Nutritionist: NextPage = () => {
  const { t } = useTranslation('common');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const { loading, isAuthorized } = useIsNutritionist();

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  if (loading || !isAuthorized) return null;

  return (
    <React.Fragment>
      <NutrNavbar />
      <main className="relative">
        <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
          <section
            id="section_2"
            className="min-h-screen overflow-hidden bg-myGrey-100 pb-16"
          >
            <div className="mx-auto max-w-[70em]">
              <h2 className="mx-auto pt-16 text-center text-2xl font-bold md:text-4xl">
                {t('nutr.searchAppointments')}
              </h2>
              <p className="mx-auto mt-3 max-w-xl px-6 text-center text-sm text-myGrey-200">
                {t('nutr.calendarHint')}
              </p>
              <CalendarC />
            </div>
          </section>

          <NutrAppointments />
          <NutrScheduler />
        </DateContext.Provider>
      </main>
    </React.Fragment>
  );
};

export default Nutritionist;
