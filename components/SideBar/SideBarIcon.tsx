type SideBarIconProps = {
  icon: any;
  text?: string;
  active?: boolean;
};

const SideBarIcon = (props: SideBarIconProps) => {
  let className =
    "flex flex-col items-center p-3 font-medium uppercase gap-y-2 hover:bg-cyan-700 hover:rounded-md";

  className += props.active ? " bg-cyan-900 rounded-md" : "";

  return (
    <div className={className}>
      <div>{props.icon}</div>
      <div>{props.text}</div>
    </div>
  );
};

export default SideBarIcon;
