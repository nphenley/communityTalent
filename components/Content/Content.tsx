import Jobs from 'components/Content/Jobs/Jobs';
import Talent from 'components/Content/Talent/Talent';
import Connections from 'components/Content/Connections/Connections';
import Profile from 'components/Content/Profile/Profile';

type ContentProps = {
  toggleState: number;
  isOpen: boolean;
  setIsOpen: any;
};

const Content = (props: ContentProps) => {
  return (
    <div className='overflow-y-scroll bg-gray-800 grow text-cyan-50'>
      {props.toggleState === 1 ? (
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

export default Content;
