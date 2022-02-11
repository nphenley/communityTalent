import { FaPlus } from 'react-icons/fa';

const PlusCard = () => (
  <div className='fixed z-40 flex justify-center w-12 h-12 bg-gray-900 border-2 border-black rounded-full shadow-lg hover:border-white bottom-4 right-10'>
    <div className='my-auto '>
      <Icon icon={<FaPlus size='20' />}></Icon>
    </div>
  </div>
);

export default PlusCard;

const Icon = ({ icon }) => <div className=''>{icon}</div>;
