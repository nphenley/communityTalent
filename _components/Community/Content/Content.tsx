import Jobs from '_components/Community/Content/Jobs/Jobs';
import Talent from '_components/Community/Content/Talent/Talent';
import Connections from '_components/Community/Content/Connections/Connections';
import Profile from '_components/Community/Content/Profile/Profile';

type ContentProps = {
  toggleState: number;
  isOpen: boolean;
  setIsOpen: any;
};

const Content = (props: ContentProps) => {
  return (
    <div className='overflow-y-scroll px-4 lg:px-0 lg:w-[96%] mx-auto'>
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
