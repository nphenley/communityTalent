type SideBarIconProps = {
  icon: any;
  text?: string;
  active?: boolean;
  width?: number;
};

const SideBarIcon = (props: SideBarIconProps) => {
  let className =
    'flex flex-col items-center py-6 w-full md:w-80 font-medium gap-y-2 hover:bg-primaryDark';

  className += props.active ? ' bg-primaryDark' : '';

  return (
    <div className={className}>
      <div>{props.icon}</div>
      <div>{props.text}</div>
    </div>
  );
};

export default SideBarIcon;
