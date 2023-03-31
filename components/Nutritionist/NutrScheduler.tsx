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
  const handleSubmit = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  // A function in order to toggle my table for phone screen media
  const handleTogglePreview = () => {
    setTogglePreview(!togglePreview);
  };

  return (
    <section id="section_4" className="min-h-screen w-full ">
      {togglePreview ? (
        <div className=" md:grid md:min-h-screen md:grid-flow-col md:content-center ">
          <div>
            <div className="scrollbar container mt-20  ml-8 touch-pan-x overflow-x-auto  md:ml-auto md:text-xl  lg:text-2xl ">
              <h1 className="mb-5  text-center font-bold capitalize ">
                Πρόγραμμα Διατροφής για τον Xρήστη <br /> testing
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

            <button
              type="submit"
              onClick={handleTogglePreview}
              className="mx-auto mt-4 block  rounded-md border-2 border-myRed py-1 px-10 font-bold   text-black hover:scale-110 hover:bg-myRed hover:font-bold  hover:text-white hover:shadow-3xl md:px-20  md:text-xl lg:px-40 lg:text-2xl  "
            >
              {togglePreview ? 'Πίσω' : 'Preview'}
            </button>
          </div>
        </div>
      ) : (
        <div className=" pt-6 md:grid md:h-screen md:grid-flow-col md:items-center md:pt-0">
          <div>
            <form className="flex flex-col  items-center  gap-4 text-base md:grid md:grid-cols-fluid md:justify-items-center  md:gap-6 md:text-lg lg:text-2xl ">
              <div className=" w-fit rounded-2xl border-2 border-black text-center hover:scale-110 hover:bg-myGrey-100 ">
                <label className=" font-bold" htmlFor="person">
                  Ορισμός σε <br />
                </label>
                <select
                  className="m-4 rounded-2xl border-2 border-myGrey-200 capitalize lg:text-xl "
                  name="person"
                  id="person"
                >
                  <option value="">Επιλέξτε πελάτη</option>
                </select>
              </div>
              <div className="w-fit rounded-2xl border-2 border-black text-center hover:scale-110 hover:bg-myGrey-100">
                <label className="font-bold" htmlFor="day">
                  Επιλέξτε Ημέρα <br />
                </label>
                <select
                  className="m-4 rounded-2xl border-2 border-myGrey-200 capitalize lg:text-xl  "
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
              <div className="w-fit rounded-2xl border-2 border-black text-center hover:scale-110 hover:bg-myGrey-100">
                <label className="font-bold" htmlFor="field">
                  Επιλέξτε Γεύμα <br />
                </label>
                <select
                  className="m-4 rounded-2xl border-2 border-myGrey-200 capitalize lg:text-xl "
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
              <div className="w-fit   rounded-2xl border-2 border-black text-center hover:scale-110 hover:bg-myGrey-100 md:col-start-2">
                <label className="font-bold" htmlFor="cell-info">
                  Ορίστε Περιεχόμενο <br />
                </label>
                <textarea
                  className="m-4 h-[8em] resize-none rounded-2xl border-2 border-myGrey-200 lg:text-xl "
                  name="cell-info"
                  id="cell-info"
                  value={cellInfo[`${selectedDay}-${selectedField}`] || ''}
                  onChange={handleCellInfoChange}
                  placeholder="Επιλέξτε το περιεχόμενο για την ημέρα και το είδος γεύματος που επιθυμείτε"
                />
              </div>
            </form>
            <button
              type="submit"
              onSubmit={handleSubmit}
              className="lg:pmt-12 mx-auto mt-8  block rounded-md border-2 border-myBlue-200  px-16   py-1 font-bold text-black hover:scale-110 hover:bg-myBlue-200 hover:font-bold hover:text-white hover:shadow-3xl md:px-40 md:text-lg lg:px-60 lg:text-2xl "
            >
              Ορισμός
            </button>
            <button
              type="submit"
              onClick={handleTogglePreview}
              className="mx-auto mt-4 block  rounded-md border-2 border-myRed py-1 px-10 font-bold   text-black hover:scale-110 hover:bg-myRed hover:font-bold  hover:text-white hover:shadow-3xl md:px-20 md:text-lg lg:px-40 lg:text-2xl "
            >
              {togglePreview ? 'Πίσω' : 'Preview'}
            </button>
          </div>
        </div>
      )}
      <div className=""></div>
    </section>
  );
};

export default NutrScheduler;
