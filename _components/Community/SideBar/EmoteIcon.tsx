type EmoteIconProps = {
  icon: any;
  number: number;
  active: boolean;
  onClick?: any;
};

const EmoteIcon = (props: EmoteIconProps) => {
  let className = 'flex flex-col items-center h-10 shadow-xl w-7 hover:invert';

  className += props.active ? ' bg-cyan-900 rounded-md' : '';

  return (
    <div onClick={props.onClick} className={className}>
      <div className='mt-1 '>{props.icon}</div>
      <div className='mt-1 text-xs border-t-2'>{props.number}</div>
    </div>
  );
};

export default EmoteIcon;
