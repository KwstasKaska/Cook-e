import Image from 'next/image';
import React, { useContext } from 'react';
import weeklyPlanner from '/public/images/weeklyplanner.jpg';
import mealsPlanner from '/public/images/meals.jpg';
import personPlanner from '/public/images/person-planner.jpg';
import contentPlanner from '/public/images/meal-planner.jpg';
import { randomFields } from '../NutrScheduler';
import { daysOfWeek } from '../NutrScheduler';
import { TableContextType } from '../../Context';

interface AccordionProps {}

const Accordion: React.FC<AccordionProps> = ({}) => {
  const { selectedDay, setSelectedDay } = useContext(TableContextType);
  const { selectedField, setSelectedField } = useContext(TableContextType);
  const { cellInfo, setCellInfo } = useContext(TableContextType);

  const handleDayChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    setSelectedDay(event.target.value);
  };

  const handleFieldChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    setSelectedField(event.target.value);
  };

  const handleCellInfoChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    event.preventDefault();

    setCellInfo({
      ...cellInfo,
      [`${selectedDay}-${selectedField}`]: event.target.value,
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const activePanel = (e.target as HTMLElement).closest(
      '[data-name="accordion-panel"]'
    );

    if (!activePanel) {
      return;
    }
    const buttons = activePanel.parentElement?.querySelectorAll('button');

    const contents = activePanel.parentElement?.querySelectorAll(
      '[data-content="accordion-content"]'
    );

    buttons?.forEach((button) => {
      button.setAttribute('aria-expanded', 'false');
    });

    contents?.forEach((content) => {
      content.setAttribute('aria-hidden', 'true');
    });

    const clickedButton = activePanel.querySelector('button');
    clickedButton?.setAttribute('aria-expanded', 'true');

    const toggleContent = activePanel.querySelector(
      '[data-content="accordion-content"]'
    );

    toggleContent?.setAttribute('aria-hidden', 'false');
  };

  return (
    <div className="container  mt-10">
      <div
        onClick={handleClick}
        className="flex flex-col gap-4  text-white  md:h-[40em] md:flex-row"
      >
        <div
          data-name="accordion-panel"
          className={`accordion-panel relative isolate  basis-[calc((0.75rem)*2+3rem)] overflow-hidden rounded-[calc(((0.75rem)*2_+_3rem)_/_2)] p-3 transition-[flex-basis_flex-grow]  duration-500 `}
        >
          <h2 id="panel1-heading">
            <button
              aria-controls="panel1-content"
              aria-expanded="true"
              className="  flex flex-row-reverse items-center gap-4"
            >
              <span
                id="panel1-title"
                className="text-2xl font-bold text-white "
              >
                Επιλέξτε Χρήστη
                <span className=""></span>
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-12 rounded-full bg-myBlue-100 p-3"
                aria-hidden="true"
                xlinkHref="#orismos"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </h2>
          <div
            data-content="accordion-content"
            id="panel1-content"
            aria-labelledby="panel1-heading"
            role="region"
            aria-hidden="false"
            className=" flex h-full flex-col items-center "
          >
            <section className="mt-12 translate-y-8 opacity-0 transition delay-300 duration-500  ">
              <select
                className=" rounded-2xl bg-myGrey-100 capitalize text-myGrey-200 lg:text-xl "
                name="person"
                id="person"
              >
                <option value="">Επιλέξτε πελάτη</option>
              </select>
            </section>
            <Image
              src={personPlanner}
              alt={'weekly calendar'}
              priority
              className="absolute inset-0 -z-[1] h-full w-full  object-cover  transition-[filter] duration-500"
            ></Image>
          </div>
        </div>

        <div
          data-name="accordion-panel"
          className={`accordion-panel relative isolate basis-[calc((0.75rem)*2+3rem)] overflow-hidden rounded-[calc(((0.75rem)*2_+_3rem)_/_2)] p-3 transition-[flex-basis_flex-grow]  duration-500 `}
        >
          <h2 id="panel2-heading">
            <button
              aria-controls="panel2-content"
              className="flex flex-row-reverse items-center gap-4"
              aria-expanded="false"
            >
              <span
                id="panel2-title"
                className="text-2xl font-bold text-white "
              >
                Επιλέξτε Ημέρα
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-12 rounded-full bg-myBlue-100 p-3"
                xlinkHref="#day"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                />
              </svg>
            </button>
          </h2>
          <div
            data-content="accordion-content"
            id="panel2-content"
            aria-labelledby="panel2-heading"
            role="region"
            aria-hidden="true"
            className=" flex h-full flex-col items-center "
          >
            <section className="mt-12  translate-y-8 opacity-0 transition delay-300 duration-500  ">
              <select
                className="rounded-2xl bg-myGrey-100 capitalize text-myGrey-200 lg:text-xl  "
                name="day"
                id="day"
                value={selectedDay}
                onChange={handleDayChange}
              >
                <option value="">Επιλέξτε Ημέρα</option>
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </section>

            <Image
              src={weeklyPlanner}
              alt={'meals image'}
              priority
              className="absolute inset-0 -z-[1] h-full w-full  object-cover  transition-[filter] duration-500"
            ></Image>
          </div>
        </div>

        <div
          data-name="accordion-panel"
          className={`accordion-panel relative isolate basis-[calc((0.75rem)*2+3rem)] overflow-hidden rounded-[calc(((0.75rem)*2_+_3rem)_/_2)] p-3 transition-[flex-basis_flex-grow] duration-500 `}
        >
          <h2 id="panel3-heading">
            <button
              aria-expanded="false"
              aria-controls="panel3-content"
              className="flex flex-row-reverse items-center gap-4"
            >
              <span
                id="panel3-title"
                className="text-2xl font-bold text-white "
              >
                Επιλέξτε Γεύμα
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className=" w-12 rounded-full bg-myBlue-100 p-3"
                xlinkHref="#meal"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </h2>
          <div
            data-content="accordion-content"
            id="panel3-content"
            aria-labelledby="panel3-heading"
            role="region"
            aria-hidden="true"
            className=" flex h-full flex-col items-center "
          >
            <section className="mt-12 translate-y-8 opacity-0 transition delay-300 duration-500  ">
              <select
                className=" rounded-2xl bg-myGrey-100 capitalize text-myGrey-200 lg:text-xl "
                name="field"
                id="field"
                value={selectedField}
                onChange={handleFieldChange}
              >
                <option value="">Επιλέξτε Γεύμα</option>
                {randomFields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </section>

            <Image
              src={mealsPlanner}
              alt={'type of meal'}
              priority
              className="absolute inset-0 -z-[1] h-full w-full  object-cover object-top  transition-[filter] duration-500"
            ></Image>
          </div>
        </div>

        <div
          data-name="accordion-panel"
          className={`accordion-panel relative isolate basis-[calc((0.75rem)*2+3rem)] overflow-hidden rounded-[calc(((0.75rem)*2_+_3rem)_/_2)] p-3 transition-[flex-basis_flex-grow] duration-500 `}
        >
          <h2 id="panel4-heading">
            <button
              aria-expanded="false"
              aria-controls="panel4-content"
              className="flex flex-row-reverse items-center gap-4"
            >
              <span
                id="panel4-title"
                className="text-2xl font-bold text-white "
              >
                Ορίστε Περιεχόμενο
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-12 rounded-full bg-myBlue-100 p-3"
                xlinkHref="#content"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122"
                />
              </svg>
            </button>
          </h2>
          <div
            data-content="accordion-content"
            id="panel4-content"
            aria-labelledby="panel4-heading"
            role="region"
            aria-hidden="true"
            className=" flex h-full flex-col items-center "
          >
            <section className="mt-12  translate-y-8 opacity-0 transition delay-300 duration-500  ">
              <textarea
                className=" h-[10em] resize-none   rounded-2xl  border-2 bg-myGrey-100 text-myGrey-200 lg:text-xl "
                name="cell-info"
                id="cell-info"
                value={cellInfo[`${selectedDay}-${selectedField}`] || ''}
                onChange={handleCellInfoChange}
                placeholder="Επιλέξτε το περιεχόμενο για την ημέρα και το είδος γεύματος που επιθυμείτε"
              />
            </section>

            <Image
              src={contentPlanner}
              alt={'content image'}
              priority
              className="absolute inset-0 -z-[1] h-full w-full  object-cover  transition-[filter] duration-500"
            ></Image>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
