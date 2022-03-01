import { useEffect, useState, useContext } from 'react';
import { Project } from '_types/Project';
import { ConnectionContext } from '_contexts/ConnectionContext';
import { getProjects, getPins, togglePinned } from '_firebase/APIRequests';
import ProjectCard from '_components/Community/Content/Projects/ProjectCard';
import PlusButton from '_components/Community/Content/Projects/PlusButton';
import ProjectForm from '_components/Community/Content/Projects/ProjectForm';

const Projects = () => {
  const [addProject, setAddProject] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [pins, setPins] = useState<string[]>([]);
  const [editProject, setEditProject] = useState(false);

  const connectionData = useContext(ConnectionContext);

  useEffect(() => {
    getPins(connectionData!.address, setPins);
    getProjects(setProjects);
  }, [connectionData, editProject, addProject]);

  return (
    <div className={styles.container}>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          editProject={editProject}
          setEditProject={setEditProject}
          walletAddress={connectionData!.address}
          isUserPinned={pins.includes(project.id)}
          togglePinned={() => togglePinned(project.id)}
        />
      ))}

      {addProject ? <ProjectForm setAddProject={setAddProject} /> : null}

      <PlusButton onClick={() => setAddProject(!addProject)} />
    </div>
  );
};

export default Projects;

const styles = {
  container: 'relative grid gap-2 grid-cols-1',
};
