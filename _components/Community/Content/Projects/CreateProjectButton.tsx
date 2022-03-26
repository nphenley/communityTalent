import { FaPlus } from 'react-icons/fa';

type CreateProjectButtonProps = {
  onClick: any;
};

const CreateProjectButton = (props: CreateProjectButtonProps) => {
  return (
    <div
      onClick={props.onClick}
      className='fixed z-40 flex justify-center w-12 h-12 bg-backgroundDark rounded-full shadow-lg bottom-4 right-4 items-center'
    >
      <FaPlus size='20' />
    </div>
  );
};

export default CreateProjectButton;
