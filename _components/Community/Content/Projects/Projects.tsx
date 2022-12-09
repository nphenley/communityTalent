import { useRouter } from 'next/router';
import { deleteProject, getProjects, toggleProjectUpvote } from '_api/projects';
import SearchBar from '_styled/SearchBar';
import LoadingSpinner from '_styled/LoadingSpinner';
import { filterProjects } from '_helpers/filterProjects';
import { ProjectSection } from '_enums/ProjectSection';
import { useContext, useEffect, useState } from 'react';
import { Project } from '_types/Project';
import CreateProjectButton from '_components/Community/Content/Projects/CreateProjectButton';
import ProjectCard from '_components/Community/Content/Projects/ProjectCard';
import ExpandedProjectCard from '_components/Community/Content/Projects/ExpandedProjectCard';
import ProjectForm from '_components/Community/Content/Projects/ProjectForm';
import { WalletGroupContext } from '_contexts/WalletGroupContext';

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
  const walletGroupID = useContext(WalletGroupContext);

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
    getProjects(walletGroupID, communityId, updateProjects);
  }, [communityId]);

  useEffect(() => {
    if (!expandedProject) return;
    const updatedExpandedProject = projects.find((project) => project.id === expandedProject.id);
    setExpandedProject(updatedExpandedProject);
  }, [projects]);

  return loadingProjects ? (
    <LoadingSpinner />
  ) : (
    <div className='flex flex-col gap-2 lg:gap-4'>
      <div className='flex justify-center mr-1 lg:justify-end'>
        <SearchBar onChange={(e: any) => setSearchQuery(e.target.value)} placeholder='Search' />
      </div>

      <div className='grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-3 4xl:grid-cols-4 5xl:grid-cols-5'>
        {filteredProjects.length ? (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className='border-4 rounded-lg border-background hover:border-primaryDark'
              onClick={() => setExpandedProject(project)}
            >
              <ProjectCard
                project={project}
                isProjectByUser={project.walletGroupID === walletGroupID}
                setProjectToEdit={setProjectToEdit}
                deleteProject={() => deleteProject(communityId, project.id)}
                toggleProjectUpvote={() =>
                  toggleProjectUpvote(walletGroupID, communityId, project.id, project.isUpvoted)
                }
                getProjects={() => getProjects(walletGroupID, communityId, updateProjects)}
              />
            </div>
          ))
        ) : (
          <div className='text-grey'>No projects in this community.</div>
        )}
      </div>

      <CreateProjectButton onClick={() => setIsAddingProject(!isAddingProject)} />

      {expandedProject && (
        <div
          className='absolute inset-0 z-50 flex justify-center bg-black bg-opacity-90'
          onClick={() => setExpandedProject(undefined)}
        >
          <div className='max-w-screen-md w-[95%] flex items-center'>
            <ExpandedProjectCard
              project={expandedProject}
              isProjectByUser={expandedProject.walletGroupID === walletGroupID}
              setProjectToEdit={setProjectToEdit}
              deleteProject={() => deleteProject(communityId, expandedProject.id)}
              toggleProjectUpvote={() =>
                toggleProjectUpvote(walletGroupID, communityId, expandedProject.id, expandedProject.isUpvoted)
              }
              getProjects={() => getProjects(walletGroupID, communityId, updateProjects)}
            />
          </div>
        </div>
      )}

      {isAddingProject && (
        <div
          className='absolute inset-0 z-50 flex justify-center bg-black bg-opacity-80'
          onClick={() => setIsAddingProject(false)}
        >
          <div className='max-w-screen-md w-[95%] flex items-center'>
            <ProjectForm
              onSubmit={async () => {
                await getProjects(walletGroupID, communityId, updateProjects);
                setProjectToEdit(undefined);
              }}
            />
          </div>
        </div>
      )}

      {projectToEdit && (
        <div
          className='absolute inset-0 z-50 flex justify-center bg-black bg-opacity-80'
          onClick={() => setProjectToEdit(undefined)}
        >
          <div className='max-w-screen-md w-[95%] flex items-center'>
            <ProjectForm
              project={projectToEdit}
              onSubmit={async () => {
                await getProjects(walletGroupID, communityId, updateProjects);
                setProjectToEdit(undefined);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Talent;
