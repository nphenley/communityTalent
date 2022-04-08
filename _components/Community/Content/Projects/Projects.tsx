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

const Projects = () => {
  const communityId = useContext(CommunityContext);
  const walletGroupID = useContext(WalletGroupContext);

  const [addProject, setAddProject] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [lfProjects, setLfProjects] = useState<Project[]>([]);
  const [lfHire, setLfHire] = useState<Project[]>([]);

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
    <div className='flex justify-center gap-2 mb-2'>
      {projectSectionButton(ProjectSection.LFPROJECTS, 'Looking For Projects')}
      {projectSectionButton(ProjectSection.LFHIRE, 'Looking to Hire')}
    </div>
  );

  return (
    <div className={styles.container}>
      {projects ? (
        <>
          {navBar}

          {projectSection === ProjectSection.LFPROJECTS ? (
            <>
              {lfProjects.map((project) => (
                <ProjectCard key={project.id} project={project} walletGroupID={walletGroupID} />
              ))}
            </>
          ) : projectSection === ProjectSection.LFHIRE ? (
            <>
              {lfHire.map((project) => (
                <ProjectCard key={project.id} project={project} walletGroupID={walletGroupID} />
              ))}
            </>
          ) : null}

          {addProject ? <ProjectForm setAddProject={setAddProject} /> : null}

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
