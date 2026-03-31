import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';

interface ReadMoreProps {
  text: string;
}

const ReadMore: React.FC<ReadMoreProps> = ({ text }) => {
  const { t } = useTranslation('common');
  const [showAll, setShowAll] = useState<Boolean>(false);
  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  // To Do: Να φτιάξω το bug που βγάζει όταν πατάω περισσότερα
  return (
    <div className="">
      <p className=" overflow-hidden text-ellipsis ">
        {showAll ? text : `${text.slice(0, 30)}...`}
      </p>
      <button
        className="text-15  text-myBlue-200 focus:underline focus:outline-none"
        onClick={toggleShowAll}
      >
        {showAll ? t('common.read_less') : t('common.read_more')}
      </button>
    </div>
  );
};

export default ReadMore;
