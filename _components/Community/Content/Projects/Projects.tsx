import { useEffect, useState, useContext } from 'react';
import { Project } from '_types/Project';
import { ConnectionContext } from '_contexts/ConnectionContext';
import { getProjects } from '_firebase/APIRequests';
import ProjectCard from '_components/Community/Content/Projects/ProjectCard';
import CreateProjectButton from '_components/Community/Content/Projects/CreateProjectButton';
import ProjectForm from '_components/Community/Content/Projects/ProjectForm';
import { CommunityContext } from '_contexts/CommunityContext';

const Projects = () => {
  const communityId = useContext(CommunityContext);

  const [addProject, setAddProject] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  const connectionData = useContext(ConnectionContext);

  useEffect(() => {
    getProjects(communityId, setProjects);
  }, [connectionData, addProject]);

  return (
    <div className={styles.container}>
      <div className='flex gap-2 justify-center'>
        <button className={styles.tabButton.concat(' text-white')}>
          Looking for Projects
        </button>
        <button className={styles.tabButton.concat(' text-grey')}>
          Looking to Hire
        </button>
        <button className={styles.tabButton.concat(' text-grey')}>
          Your Projects
        </button>
      </div>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          walletAddress={connectionData!.address}
        />
      ))}

      {addProject ? <ProjectForm setAddProject={setAddProject} /> : null}

      <CreateProjectButton onClick={() => setAddProject(!addProject)} />
    </div>
  );
};

export default Projects;

const styles = {
  container: 'relative grid gap-2 grid-cols-1',
  tabButton: 'font-medium bg-backgroundDark px-5 py-4 rounded-lg',
};
