import { FaThumbtack, FaSkull } from 'react-icons/fa';
import EmoteIcon from 'components/SideBar/EmoteIcon';

type JobCardProps = {
  id: string;
  title: string;
  description: string;
  tags: boolean[];
  user: string;
  numberOfPins: number;
  isUserPinned: boolean;
  togglePinned: any;
};

const JobCard = (props: JobCardProps) => (
  <div className='relative overflow-hidden bg-gray-900 rounded shadow-lg h-72'>
    <div className='px-6 py-4'>
      <div className='text-xl font-bold'>{props.title}</div>
      <div className='absolute top-3 right-3'>
        <div className='flex'>
          <EmoteIcon
            onClick={() => props.togglePinned(props.id)}
            active={props.isUserPinned}
            number={props.numberOfPins}
            icon={<FaThumbtack size={12} />}
          />
          <EmoteIcon number={0} active={false} icon={<FaSkull size={12} />} />
        </div>
      </div>

      <p className='text-sm'>{props.user}</p>
      <p className='text-base text-gray-500'>{props.description}</p>
    </div>
    <div className='px-6 pt-4 pb-2'>
      <span
        className={`absolute bottom-3 px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full ${
          props.tags[0] === true ? 'block' : 'hidden'
        }`}
      >
        Dev
      </span>
      <span
        className={`absolute bottom-3 px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full ${
          props.tags[1] === true ? 'block' : 'hidden'
        }`}
      >
        Marketing
      </span>
      <span
        className={`absolute bottom-3 px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full ${
          props.tags[2] === true ? 'block' : 'hidden'
        }`}
      >
        Art
      </span>
    </div>
  </div>
);

export default JobCard;
