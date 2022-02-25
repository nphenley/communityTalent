import { FaThumbtack, FaSkull } from 'react-icons/fa';
import EmoteIcon from '_components/Community/SideBar/EmoteIcon';
import { Project } from '_types/Project';

type ProjectCardProps = {
  project: Project;
  isUserPinned: boolean;
  togglePinned: any;
};

const ProjectCard = (props: ProjectCardProps) => {
  return (
    <div className='relative overflow-hidden bg-backgroundDark rounded shadow-lg h-72'>
      <div className='px-6 py-4'>
        <div className='text-xl font-bold'>{props.project.title}</div>
        <div className='absolute top-3 right-3'>
          <div className='flex'>
            <EmoteIcon
              onClick={() => props.togglePinned(props.project.id)}
              active={props.isUserPinned}
              number={props.project.numberOfPins}
              icon={<FaThumbtack size={12} />}
            />
            <EmoteIcon number={0} active={false} icon={<FaSkull size={12} />} />
          </div>
        </div>

        <p className='text-sm'>{props.project.authors}</p>
        <p className='text-base text-gray-500'>{props.project.description}</p>
      </div>
      <div className='px-6 pt-4 pb-2'>
        <span
          className={`absolute bottom-3 px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full ${
            props.project.tags.includes('dev') ? 'block' : 'hidden'
          }`}
        >
          Dev
        </span>
        <span
          className={`absolute bottom-3 px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full ${
            props.project.tags.includes('marketing') ? 'block' : 'hidden'
          }`}
        >
          Marketing
        </span>
        <span
          className={`absolute bottom-3 px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full ${
            props.project.tags.includes('art') ? 'block' : 'hidden'
          }`}
        >
          Art
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;
