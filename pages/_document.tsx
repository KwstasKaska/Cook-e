import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html className="h-full">
      <Head>
        <title>Cook-e</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      <body className="min-h-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
