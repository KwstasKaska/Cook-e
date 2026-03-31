import React, { useState } from 'react';
import NutrNavbar from '../components/Nutritionist/NutrNavbar';
import Footer from '../components/Users/Footer';
import CalendarC from '../components/Nutritionist/CalendarC';
import NutrAppointments from '../components/Nutritionist/NutrAppointments';
import NutrArticles from '../components/Nutritionist/NutrArticles';
import Image from 'next/image';
import { DateContext } from '../components/Context';
import ScrollToTopButton from '../components/Helper/ScrollToTopButton';
import NutrScheduler from '../components/Nutritionist/NutrScheduler';
import { MeDocument, MeQuery } from '../generated/graphql';
import profile from '/public/images/myphoto.jpg';
import { GetServerSidePropsContext, NextPage } from 'next';
import { initializeApollo, addApolloState } from '../lib/apolloClient';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

interface NutritionistProps {
  meData?: MeQuery;
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const client = initializeApollo({ headers: context.req.headers });
  const { data: meData } = await client.query({ query: MeDocument });

  if (!meData?.me) {
    return {
      redirect: {
        destination: '/login?next=' + encodeURIComponent(context.req.url ?? ''),
        permanent: false,
      },
    };
  }
  if (meData.me.role !== 'NUTRITIONIST') {
    return { redirect: { destination: '/', permanent: false } };
  }

  return addApolloState(client, {
    props: {
      meData,
      ...(await serverSideTranslations(context.locale!, ['common'])),
    },
  });
};

const Nutritionist: NextPage<NutritionistProps> = ({ meData }) => {
  const { t } = useTranslation('common');
  const [selectedDate, setSelectedDate] = useState<string>('');

  return (
    <React.Fragment>
      <NutrNavbar />
      <main className="relative">
        {/* Welcome header */}
        <div className="grid grid-flow-col-dense justify-start pt-10 pb-6 pl-5 md:pl-20 xl:pl-32 gap-x-4">
          <Image
            src={profile}
            alt={'profile'}
            className="row-span-2 max-h-14 max-w-[3.5rem] justify-self-end rounded-full object-cover object-top md:max-h-20 md:max-w-[5rem] xl:max-h-28 xl:max-w-[7rem]"
          />
          <h1 className="text-2xl font-bold md:text-4xl">
            {t('nutr.welcome')}, <br /> Dr. {meData?.me?.username}
          </h1>
          <p className="text-sm leading-relaxed text-gray-600 md:text-base">
            {t('nutr.howIsYourDay')}
          </p>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute left-[1.3em] top-[2em] -z-[1] h-[9em] w-[18em] -rotate-[13deg] rounded-[1em] bg-myGrey-100 md:left-28 md:scale-125 xl:left-48 xl:scale-150 2xl:left-64 2xl:top-20 2xl:scale-[2]" />
        <div className="absolute left-[5em] top-[5em] -z-[2] h-[9em] w-[18em] -rotate-[13deg] rounded-[1em] bg-myBlue-100 md:left-48 md:scale-125 xl:left-72 xl:scale-150 2xl:top-40 2xl:left-[22em] 2xl:scale-[2]" />

        <NutrArticles />

        <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
          <section
            id="section_2"
            className="min-h-screen overflow-hidden bg-myGrey-100 pb-16"
          >
            <div className="mx-auto max-w-[70em]">
              <h2 className="mx-auto pt-16 text-center text-2xl font-bold md:text-4xl">
                {t('nutr.searchAppointments')}
              </h2>
              <CalendarC />
            </div>
          </section>

          <NutrAppointments />
          <NutrScheduler />
        </DateContext.Provider>

        <ScrollToTopButton />
      </main>
      <Footer />
    </React.Fragment>
  );
};

export default Nutritionist;
