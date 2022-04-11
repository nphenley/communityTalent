import { useEffect, useState, useContext } from 'react';
import { Project } from '_types/Project';
import { getProjects } from '_api/projects';
import ProjectCard from '_components/Community/Content/Projects/ProjectCard';
import CreateProjectButton from '_components/Community/Content/Projects/CreateProjectButton';
import ProjectForm from '_components/Community/Content/Projects/ProjectForm';
import { CommunityContext } from '_contexts/CommunityContext';
import { WalletGroupContext } from '_contexts/WalletGroupContext';
import LoadingSpinner from '_styled/LoadingSpinner';
import { ProjectSection } from '_enums/ProjectSection';
import { ProfileContext } from '_contexts/ProfileContext';

const Projects = () => {
  const communityId = useContext(CommunityContext);
  const walletGroupID = useContext(WalletGroupContext);
  const userProfile = useContext(ProfileContext);

  const [addProject, setAddProject] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [lfProjects, setLfProjects] = useState<Project[]>([]);
  const [lfHire, setLfHire] = useState<Project[]>([]);
  const [isYourProjects, setIsYourProjects] = useState(false);
  const [projectSection, setProjectSection] = useState<ProjectSection>(ProjectSection.LFPROJECTS);

  useEffect(() => {
    getProjects(communityId, setProjects);
  }, [communityId, addProject]);

  useEffect(() => {
    const lfProjects = projects.filter((project) => !project.hiring);
    setLfProjects(lfProjects);
    const lfHire = projects.filter((project) => project.hiring);
    setLfHire(lfHire);
  }, [projects]);

  const projectSectionButton = (section: ProjectSection, text: string) => {
    let className = styles.tabButton;
    projectSection === section ? (className += ' text-white') : (className += ' text-grey');
    return (
      <button
        onClick={() => {
          setProjectSection(section);
        }}
        className={className}
      >
        {text}
      </button>
    );
  };

  const navBar = (
    <div className='flex'>
      <div className='flex flex-row justify-center gap-2 mb-2 grow'>
        {projectSectionButton(ProjectSection.LFPROJECTS, 'Looking For Projects')}
        {projectSectionButton(ProjectSection.LFHIRE, 'Looking to Hire')}
      </div>
      <button className='px-3 mb-2 font-medium rounded-lg py-auto bg-backgroundDark'>
        <div className='flex flex-col items-center'>
          <label className=''>Yours</label>
          <input className='' type='checkbox' onChange={() => setIsYourProjects(!isYourProjects)} name='yours' />
        </div>
      </button>
    </div>
  );

  return (
    <div className={styles.container}>
      {projects && userProfile ? (
        <>
          {navBar}

          {projectSection === ProjectSection.LFPROJECTS ? (
            <>
              {lfProjects.map((project) => (
                <>
                  {isYourProjects ? (
                    project.walletGroupID === walletGroupID ? (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        walletGroupID={walletGroupID}
                        admin={userProfile.admin}
                        setProjects={setProjects}
                      />
                    ) : null
                  ) : (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      walletGroupID={walletGroupID}
                      admin={userProfile.admin}
                      setProjects={setProjects}
                    />
                  )}
                </>
              ))}
            </>
          ) : projectSection === ProjectSection.LFHIRE ? (
            <>
              {lfHire.map((project) => (
                <>
                  {isYourProjects ? (
                    project.walletGroupID === walletGroupID ? (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        walletGroupID={walletGroupID}
                        admin={userProfile.admin}
                        setProjects={setProjects}
                      />
                    ) : null
                  ) : (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      walletGroupID={walletGroupID}
                      admin={userProfile.admin}
                      setProjects={setProjects}
                    />
                  )}
                </>
              ))}
            </>
          ) : null}

          {addProject ? <ProjectForm setAddProject={setAddProject} setProjects={setProjects} /> : null}

          <CreateProjectButton onClick={() => setAddProject(!addProject)} />
        </>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default Projects;

const styles = {
  container: 'relative grid gap-1 grid-cols-1',
  tabButton: 'font-medium bg-backgroundDark px-5 py-4 rounded-lg',
};
