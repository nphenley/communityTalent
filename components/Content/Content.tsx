import Jobs from 'components/Content/Jobs/Jobs';
import Talent from 'components/Content/Talent/Talent';
import Connections from 'components/Content/Connections/Connections';
import Profile from 'components/Content/Profile/Profile';
import { ConnectionContext } from 'contexts/ConnectionContext';
import { useContext } from 'react';

type MainViewProps = {
  toggleState: number;
  isOpen: boolean;
  setIsOpen: any;
};

const MainView = (props: MainViewProps) => {
  const connectionData = useContext(ConnectionContext);

  const disconnectedView = (
    <div className='flex items-center justify-center h-full'>
      Please connect your wallet.
    </div>
  );

  const connectedView =
    props.toggleState === 1 ? (
      <Jobs />
    ) : props.toggleState === 2 ? (
      <Talent />
    ) : props.toggleState === 3 ? (
      <Connections />
    ) : props.toggleState === 4 ? (
      <Profile />
    ) : null;

  return (
    <div className='overflow-y-scroll bg-gray-800 grow text-cyan-50'>
      {connectionData?.isAuthenticated ? connectedView : disconnectedView}
    </div>
  );
};

export default MainView;
