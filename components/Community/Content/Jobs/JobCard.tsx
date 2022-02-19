import { FaThumbtack, FaSkull } from 'react-icons/fa';
import EmoteIcon from 'components/Community/SideBar/EmoteIcon';
import { Job } from 'types/Job';

type JobCardProps = {
  job: Job;
  isUserPinned: boolean;
  togglePinned: any;
};

const JobCard = (props: JobCardProps) => {
  return (
    <div className='relative overflow-hidden bg-backgroundDark rounded shadow-lg h-72'>
      <div className='px-6 py-4'>
        <div className='text-xl font-bold'>{props.job.title}</div>
        <div className='absolute top-3 right-3'>
          <div className='flex'>
            <EmoteIcon
              onClick={() => props.togglePinned(props.job.id)}
              active={props.isUserPinned}
              number={props.job.numberOfPins}
              icon={<FaThumbtack size={12} />}
            />
            <EmoteIcon number={0} active={false} icon={<FaSkull size={12} />} />
          </div>
        </div>

        <p className='text-sm'>{props.job.authors}</p>
        <p className='text-base text-gray-500'>{props.job.description}</p>
      </div>
      <div className='px-6 pt-4 pb-2'>
        <span
          className={`absolute bottom-3 px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full ${
            props.job.tags.includes('dev') ? 'block' : 'hidden'
          }`}
        >
          Dev
        </span>
        <span
          className={`absolute bottom-3 px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full ${
            props.job.tags.includes('marketing') ? 'block' : 'hidden'
          }`}
        >
          Marketing
        </span>
        <span
          className={`absolute bottom-3 px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full ${
            props.job.tags.includes('art') ? 'block' : 'hidden'
          }`}
        >
          Art
        </span>
      </div>
    </div>
  );
};

export default JobCard;
