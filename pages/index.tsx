import Main from 'components/Main';
import { MoralisProvider } from 'react-moralis';

export default function Home() {
  return (
    <MoralisProvider
      appId={process.env.NEXT_PUBLIC_MORALIS_APPLICATION_ID!}
      serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER_URL!}
    >
      <Main />
    </MoralisProvider>
  );
}

// TODO:
// SideBar moving in and out needs to be animated. ease-in-out duration-300
// Needs to be made responsive to mobile screens, sidebar functionality.
// Move wallet connecting up a level.

// Notes:
// Maybe a bug with tailwind using w- and h- lol
// Use padding instead
