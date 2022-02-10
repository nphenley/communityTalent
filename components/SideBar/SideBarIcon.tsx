type SideBarIconProps = {
	icon: any;
	text?: string;
};

const SideBarIcon = (props: SideBarIconProps) => (
	<div className='flex flex-col items-center hover:bg-cyan-700 hover:rounded-md'>
		<div>{props.icon}</div>
		<div>{props.text}</div>
	</div>
);

export default SideBarIcon;
