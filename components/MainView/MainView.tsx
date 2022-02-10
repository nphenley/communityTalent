import Jobs from 'components/MainView/Jobs';
import Talent from 'components/MainView/Talent';
import Connections from 'components/MainView/Connections';
import Profile from 'components/MainView/Profile';

type MainViewProps = {
  toggleState: number;
  isOpen: boolean;
  setIsOpen: any;
  isConnected: boolean;
  setIsConnected: any;
};

const MainView = (props: MainViewProps) => {
  const disconnectedView = (
    <div className='flex justify-center items-center h-full'>
      Please connect your wallet.
    </div>
  );

  return (
    <div className='grow bg-gray-800 text-cyan-50 overflow-y-scroll'>
      {!props.isConnected ? (
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
