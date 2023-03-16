import Head from 'next/head';
import React from 'react';
import favIcon from '/public/images/favicon.ico';

export interface Props {
  title: string;
}

const HeadComponent: React.FC<Props> = ({ title }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      ></meta>
      <link rel="icon" href={favIcon.src} type="image/x-icon" />
    </Head>
  );
};

export default HeadComponent;
