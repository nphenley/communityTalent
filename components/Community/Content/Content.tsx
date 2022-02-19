import Jobs from 'components/Community/Content/Jobs/Jobs';
import Talent from 'components/Community/Content/Talent/Talent';
import Connections from 'components/Community/Content/Connections/Connections';
import Profile from 'components/Community/Content/Profile/Profile';

type ContentProps = {
  toggleState: number;
  isOpen: boolean;
  setIsOpen: any;
};

const Content = (props: ContentProps) => {
  return (
    <div className='overflow-y-scroll grow p-14'>
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
