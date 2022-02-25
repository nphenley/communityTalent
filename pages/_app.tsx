import '../styles/globals.css';
import { MoralisProvider } from 'react-moralis';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider
      appId={process.env.NEXT_PUBLIC_MORALIS_APPLICATION_ID!}
      serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER_URL!}
    >
      <Component {...pageProps} />
    </MoralisProvider>
  );
}

export default MyApp;
