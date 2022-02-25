import Projects from '_components/Community/Content/Projects/Projects';
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
    <div className='overflow-y-auto'>
      <div className=' px-4 lg:px-0 lg:max-w-[96%] mx-auto w-full py-4'>
        {props.toggleState === 1 ? (
          <Projects />
        ) : props.toggleState === 2 ? (
          <Talent />
        ) : props.toggleState === 3 ? (
          <Connections />
        ) : props.toggleState === 4 ? (
          <Profile />
        ) : null}
      </div>
    </div>
  );
};

export default Content;
