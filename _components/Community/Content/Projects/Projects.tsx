import { useRouter } from 'next/router';
import { deleteProject, getProjects } from '_api/projects';
import SearchBar from '_styled/SearchBar';
import LoadingSpinner from '_styled/LoadingSpinner';
import { filterProjects } from '_helpers/filterProjects';
import { ProjectSection } from '_enums/ProjectSection';
import { useEffect, useState } from 'react';
import { Project } from '_types/Project';
import CreateProjectButton from '_components/Community/Content/Projects/CreateProjectButton';
import ProjectCard from '_components/Community/Content/Projects/ProjectCard';
import ExpandedProjectCard from '_components/Community/Content/Projects/ExpandedProjectCard';
import ProjectForm from '_components/Community/Content/Projects/ProjectForm';

// type ProjectSectionButtonProps = {
//   section: ProjectSection;
//   currentlyActiveSection: ProjectSection;
//   setProjectSection: any;
//   text: string;
// };

// const ProjectSectionButton = (props: ProjectSectionButtonProps) => {
//   let className =
//     'font-medium px-5 py-4 rounded-lg' +
//     (props.currentlyActiveSection === props.section
//       ? ' text-primary bg-backgroundDark'
//       : ' text-grey bg-backgroundDark');
//   return (
//     <button onClick={() => props.setProjectSection(props.section)} className={className}>
//       {props.text}
//     </button>
//   );
// };

const Talent = () => {
  const router = useRouter();
  const communityId = router.query.communityId as string;

  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [expandedProject, setExpandedProject] = useState<Project>();

  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project>();

  useEffect(() => {
    const filteredProjects = filterProjects(projects, searchQuery);
    setFilteredProjects(filteredProjects);
  }, [projects, searchQuery]);

  const updateProjects = (projects: Project[]) => {
    setProjects(projects);
    setFilteredProjects(projects);
    setLoadingProjects(false);
  };

  useEffect(() => {
    getProjects(communityId, updateProjects);
  }, [communityId]);

  return loadingProjects ? (
    <LoadingSpinner />
  ) : (
    <div className='flex flex-col gap-2 lg:gap-4'>
      <div className='flex justify-center lg:justify-end'>
        <SearchBar onChange={(e: any) => setSearchQuery(e.target.value)} placeholder='Search' />
      </div>

      <div className='grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-3 4xl:grid-cols-4 5xl:grid-cols-5'>
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className='border-background border-4 hover:border-primaryDark rounded-lg'
            onClick={() => setExpandedProject(project)}
          >
            <ProjectCard
              project={project}
              setProjectToEdit={setProjectToEdit}
              deleteProject={() => deleteProject(communityId, project.id, setProjects)}
            />
          </div>
        ))}
      </div>

      <CreateProjectButton onClick={() => setIsAddingProject(!isAddingProject)} />

      {expandedProject && (
        <div
          className='z-50 absolute inset-0 bg-black bg-opacity-90 flex justify-center'
          onClick={() => setExpandedProject(undefined)}
        >
          <div className='max-w-screen-md w-[95%] flex items-center'>
            <ExpandedProjectCard
              project={expandedProject}
              setProjectToEdit={setProjectToEdit}
              deleteProject={() => deleteProject(communityId, expandedProject.id, setProjects)}
            />
          </div>
        </div>
      )}

      {isAddingProject && (
        <div
          className='z-50 absolute inset-0 bg-black bg-opacity-80 flex justify-center'
          onClick={() => setIsAddingProject(false)}
        >
          <div className='max-w-screen-md w-[95%] flex items-center'>
            <ProjectForm onSubmit={() => setIsAddingProject(false)} setProjects={setProjects} />
          </div>
        </div>
      )}

      {projectToEdit && (
        <div
          className='z-50 absolute inset-0 bg-black bg-opacity-80 flex justify-center'
          onClick={() => setProjectToEdit(undefined)}
        >
          <div className='max-w-screen-md w-[95%] flex items-center'>
            <ProjectForm
              project={projectToEdit}
              onSubmit={() => setProjectToEdit(undefined)}
              setProjects={setProjects}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Talent;
