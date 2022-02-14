type EmoteIconProps = {
  icon: any;
  pins: number;
};

const EmoteIcon = (props: EmoteIconProps) => {
  return (
    <div className='flex flex-col items-center h-10 bg-gray-800 shadow-xl w-7 hover:invert'>
      <div className='mt-1 '>{props.icon}</div>
      <div className='mt-1 text-xs border-t-2'>{props.pins}</div>
    </div>
  );
};

export default EmoteIcon;
