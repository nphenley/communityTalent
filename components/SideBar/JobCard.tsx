import { faSkull } from '@fortawesome/free-solid-svg-icons';
import { FaThumbtack, FaSkull } from 'react-icons/fa';
import EmoteIcon from './EmoteIcon';

const JobCard = ({ title, description, tags, user, pins }) => (
  <div className='relative overflow-hidden bg-gray-900 rounded shadow-lg h-72'>
    <div className='px-6 py-4'>
      <div className='text-xl font-bold'>{title}</div>
      <div className='absolute top-3 right-3'>
        <div className='flex'>
          <EmoteIcon pins={pins} icon={<FaThumbtack size={12} />}></EmoteIcon>
          <EmoteIcon pins={0} icon={<FaSkull size={12} />}></EmoteIcon>
        </div>
      </div>

      <p className='text-sm'>{user}</p>
      <p className='text-base text-gray-500'>{description}</p>
    </div>
    <div className='px-6 pt-4 pb-2'>
      <span
        className={`absolute bottom-3 px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full ${
          tags[0] === true ? 'block' : 'hidden'
        }`}
      >
        Dev
      </span>
      <span
        className={`absolute bottom-3 px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full ${
          tags[1] === true ? 'block' : 'hidden'
        }`}
      >
        Marketing
      </span>
      <span
        className={`absolute bottom-3 px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full ${
          tags[2] === true ? 'block' : 'hidden'
        }`}
      >
        Art
      </span>
    </div>
  </div>
);

export default JobCard;
