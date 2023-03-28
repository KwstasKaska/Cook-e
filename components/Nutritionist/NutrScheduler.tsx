import React, { useState } from 'react';

interface NutrSchedulerProps {}

const daysOfWeek = [
  'Δευτερα',
  'Τριτη',
  'Τεταρτη',
  'πεμπτη',
  'παρασκευη',
  'σαββατο',
  'κυριακη',
];
const randomFields = [
  'Πρωινο',
  'δεκατιανο',
  'μεσημεριανο',
  'απογευματινο',
  'βραδινο',
];

type CellInfo = Record<string, string>;

const NutrScheduler: React.FC<NutrSchedulerProps> = ({}) => {
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedField, setSelectedField] = useState<string>('');
  const [cellInfo, setCellInfo] = useState<CellInfo>({});
  const [togglePreview, setTogglePreview] = useState<boolean>(false);

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

  // A function that
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  // A function in order to toggle my table for phone screen media
  const handleTogglePreview = () => {
    setTogglePreview(!togglePreview);
  };

  const customClassName = togglePreview
    ? 'min-h-screen w-full '
    : 'w-full h-screen ';

  return (
    <section id="section_4" className={customClassName}>
      {togglePreview ? (
        <div className="scrollbar container  mt-20 ml-8 touch-pan-x  overflow-x-auto md:ml-auto  ">
          <h1 className="mb-5 text-center font-bold capitalize">
            Πρόγραμμα Διατροφής για τον Xρήστη: testing
          </h1>
          <table className="mx-auto border-separate border-myGrey-200 ">
            <thead>
              <tr className="snap-x snap-mandatory">
                <th className="snap-center">Γεύματα / Ημέρες</th>
                {daysOfWeek.map((day) => (
                  <th
                    key={day}
                    className=" snap-center p-4 text-center capitalize"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {randomFields.map((field) => (
                <tr key={field}>
                  <th className="text-center capitalize">{field}</th>

                  {daysOfWeek.map((day) => (
                    <td
                      key={`${day}-${field}`}
                      className="min-w-[18em] lg:min-w-full"
                    >
                      {cellInfo[`${day}-${field}`]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="my-8">
          <form onSubmit={handleSubmit} className="flex flex-col  gap-4">
            <div className="">
              <label className="" htmlFor="person">
                Ορισμός σε:
              </label>
              <select className=" capitalize" name="person" id="person">
                <option value="">Επιλέξτε πελάτη</option>
              </select>
            </div>
            <div className="">
              <label className="" htmlFor="day">
                Επιλέξτε Ημέρα:
              </label>
              <select
                className=" capitalize"
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
            </div>
            <div className="">
              <label className="" htmlFor="field">
                Επιλέξτε Γεύμα:
              </label>
              <select
                className=" capitalize "
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
            </div>
            <div className="">
              <label className="" htmlFor="cell-info">
                Ορίστε Περιεχόμενο:
              </label>
              <textarea
                className="resize"
                name="cell-info"
                id="cell-info"
                value={cellInfo[`${selectedDay}-${selectedField}`] || ''}
                onChange={handleCellInfoChange}
                placeholder="Enter cell info here"
              />
            </div>
            <button
              type="submit"
              className=" rounded-md bg-myBlue-200   py-1   text-white hover:bg-myBlue-100 hover:font-bold hover:text-black hover:shadow-3xl"
            >
              Ορισμός
            </button>
          </form>
        </div>
      )}
      <div className="">
        <button
          type="submit"
          onClick={handleTogglePreview}
          className="mx-auto mt-4 block  rounded-md bg-myRed py-1 px-10 text-white   hover:bg-myGrey-200 hover:font-bold hover:shadow-3xl  lg:px-40"
        >
          {togglePreview ? 'Πίσω' : 'Preview'}
        </button>
      </div>
    </section>
  );
};

export default NutrScheduler;
