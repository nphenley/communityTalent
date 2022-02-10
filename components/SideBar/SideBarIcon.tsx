type SideBarIconProps = {
	icon: any;
	text?: string;
};

const SideBarIcon = (props: SideBarIconProps) => (
	<div className='flex flex-col gap-y-2 items-center font-medium uppercase hover:bg-cyan-700 hover:rounded-md p-3'>
		<div>{props.icon}</div>
		<div>{props.text}</div>
	</div>
);

export default SideBarIcon;
