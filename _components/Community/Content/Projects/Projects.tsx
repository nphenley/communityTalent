import { useEffect, useState, useContext } from 'react';
import { Project } from '_types/Project';
import { getProjects } from '_api/projects';
import ProjectCard from '_components/Community/Content/Projects/ProjectCard';
import CreateProjectButton from '_components/Community/Content/Projects/CreateProjectButton';
import ProjectForm from '_components/Community/Content/Projects/ProjectForm';
import { CommunityContext } from '_contexts/CommunityContext';
import { WalletGroupContext } from '_contexts/WalletGroupContext';
import { ProjectSection } from '_enums/ProjectSection';
import { ProfileContext } from '_contexts/ProfileContext';
import ToggleButton from '_styled/ToggleButton';

const Projects = () => {
  const communityId = useContext(CommunityContext);
  const walletGroupID = useContext(WalletGroupContext);
  const userProfile = useContext(ProfileContext);

  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [lfProjects, setLfProjects] = useState<Project[]>([]);
  const [lfHire, setLfHire] = useState<Project[]>([]);
  const [isYourProjects, setIsYourProjects] = useState(false);
  const [projectSection, setProjectSection] = useState<ProjectSection>(ProjectSection.LFPROJECTS);

  useEffect(() => {
    getProjects(communityId, setProjects);
  }, [communityId, isAddingProject]);

  useEffect(() => {
    const lfProjects = projects.filter((project) => !project.hiring);
    setLfProjects(lfProjects);
    const lfHire = projects.filter((project) => project.hiring);
    setLfHire(lfHire);
  }, [projects]);

  const navBar = (
    <div className='flex grid grid-cols-2 gap-1 relative'>
      <div className='flex flex-row-reverse'>
        <ProjectSectionButton
          section={ProjectSection.LFPROJECTS}
          currentlyActiveSection={projectSection}
          setProjectSection={setProjectSection}
          text='Looking For Projects'
        />
      </div>
      <div className='flex flex-row'>
        <ProjectSectionButton
          section={ProjectSection.LFHIRE}
          currentlyActiveSection={projectSection}
          setProjectSection={setProjectSection}
          text='Looking to Hire'
        />
      </div>
      <button className='absolute top-[50%] translate-y-[-50%] right-0 font-medium'>
        <div className='flex items-center gap-2'>
          <ToggleButton onClick={() => setIsYourProjects(!isYourProjects)} size='small' />
          <label className={`text-xs ${isYourProjects ? ' text-primary' : ' text-grey'}`}>Your Projects</label>
        </div>
      </button>
    </div>
  );

  return (
    <div className={styles.container}>
      {navBar}

      <div className='grid gap-1 grid-cols-2'>
        {projectSection === ProjectSection.LFPROJECTS ? (
          <>
            {lfProjects.map((project) =>
              isYourProjects ? (
                project.walletGroupID === walletGroupID ? (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    walletGroupID={walletGroupID}
                    admin={userProfile!.admin}
                    setProjects={setProjects}
                  />
                ) : null
              ) : (
                <ProjectCard
                  key={project.id}
                  project={project}
                  walletGroupID={walletGroupID}
                  admin={userProfile!.admin}
                  setProjects={setProjects}
                />
              )
            )}
          </>
        ) : projectSection === ProjectSection.LFHIRE ? (
          <>
            {lfHire.map((project) =>
              isYourProjects ? (
                project.walletGroupID === walletGroupID ? (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    walletGroupID={walletGroupID}
                    admin={userProfile!.admin}
                    setProjects={setProjects}
                  />
                ) : null
              ) : (
                <ProjectCard
                  key={project.id}
                  project={project}
                  walletGroupID={walletGroupID}
                  admin={userProfile!.admin}
                  setProjects={setProjects}
                />
              )
            )}
          </>
        ) : null}
      </div>

      {isAddingProject ? <ProjectForm setIsAddingProject={setIsAddingProject} setProjects={setProjects} /> : null}

      <CreateProjectButton onClick={() => setIsAddingProject(!isAddingProject)} />
    </div>
  );
};

export default Projects;

const styles = {
  container: 'flex flex-col gap-y-4 relative',
  tabButton: 'font-medium px-5 py-4 rounded-lg',
};

type ProjectSectionButtonProps = {
  section: ProjectSection;
  currentlyActiveSection: ProjectSection;
  setProjectSection: any;
  text: string;
};

const ProjectSectionButton = (props: ProjectSectionButtonProps) => {
  let className =
    styles.tabButton +
    (props.currentlyActiveSection === props.section
      ? ' text-primary bg-backgroundDark'
      : ' text-grey bg-backgroundDark');
  return (
    <button onClick={() => props.setProjectSection(props.section)} className={className}>
      {props.text}
    </button>
  );
};
