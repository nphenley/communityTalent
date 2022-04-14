import Projects from '_components/Community/Content/Projects/Projects';
import Talent from '_components/Community/Content/Talent/Talent';
import Profile from '_components/Community/Content/Profile/Profile';
import { Sections } from '_enums/Sections';

type ContentProps = {
  toggleState: Sections;
};

const Content = (props: ContentProps) => {
  return (
    <div className='px-4 lg:px-0 lg:max-w-[96%] mx-auto w-full py-4 grow overflow-y-scroll'>
      {props.toggleState === Sections.PROFILE ? (
        <Profile />
      ) : props.toggleState === Sections.PROJECTS ? (
        <Projects />
      ) : props.toggleState === Sections.TALENT ? (
        <Talent />
      ) : null}
    </div>
  );
};

export default Content;
