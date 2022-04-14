import { useRouter } from 'next/router';
import { getProjects } from '_api/projects';
import SearchBar from '_styled/SearchBar';
import LoadingSpinner from '_styled/LoadingSpinner';
import { filterProjects } from '_helpers/filterProjects';
import { ProjectSection } from '_enums/ProjectSection';
import { useEffect, useState } from 'react';
import { Project } from '_types/Project';
import CreateProjectButton from '_components/Community/Content/Projects/CreateProjectButton';
import ProjectCard from '_components/Community/Content/Projects/ProjectCard';
import ExpandedProjectCard from '_components/Community/Content/Projects/ExpandedProjectCard';

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

  useEffect(() => {
    const filteredProjects = filterProjects(projects, searchQuery);
    setFilteredProjects(filteredProjects);
  }, [searchQuery]);

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
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      {expandedProject && (
        <div
          className='absolute inset-0 bg-black bg-opacity-50 flex justify-center'
          onClick={() => setExpandedProject(undefined)}
        >
          <div className='max-w-screen-lg w-[95%] flex items-center'>
            <ExpandedProjectCard project={expandedProject} />
          </div>
        </div>
      )}

      <CreateProjectButton onClick={() => setIsAddingProject(!isAddingProject)} />
    </div>
  );
};

export default Talent;
