type SideBarIconProps = {
  icon: any;
  text?: string;
  active?: boolean;
  width?: number;
  wip?: boolean;
};

const SideBarIcon = (props: SideBarIconProps) => {
  let className =
    'flex flex-col items-center py-6 w-full md:w-60 lg:w-80 font-medium gap-y-2 select-none';

  className += props.active ? ' bg-primaryDark' : '';

  className += props.wip ? ' text-grey hover:bg-' : ' hover:bg-primaryDark';

  return (
    <div className={className}>
      <div>{props.icon}</div>
      <div>{props.text}</div>
    </div>
  );
};

export default SideBarIcon;
