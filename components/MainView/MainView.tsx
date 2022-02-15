import Jobs from 'components/MainView/Jobs/Jobs';
import Talent from 'components/MainView/Talent';
import Connections from 'components/MainView/Connections';
import Profile from 'components/MainView/Profile';
import { useMoralis } from 'react-moralis';

type MainViewProps = {
  toggleState: number;
  isOpen: boolean;
  setIsOpen: any;
};

const MainView = (props: MainViewProps) => {
  const { isAuthenticated } = useMoralis();

  const disconnectedView = (
    <div className='flex items-center justify-center h-full'>
      Please connect your wallet.
    </div>
  );

  return (
    <div className='overflow-y-scroll bg-gray-800 grow text-cyan-50'>
      {!isAuthenticated ? (
        disconnectedView
      ) : props.toggleState === 1 ? (
        <Jobs />
      ) : props.toggleState === 2 ? (
        <Talent />
      ) : props.toggleState === 3 ? (
        <Connections />
      ) : props.toggleState === 4 ? (
        <Profile />
      ) : null}
    </div>
  );
};

export default MainView;
