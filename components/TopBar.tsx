import { FaBars } from 'react-icons/fa';

type TopBarProps = {
	isOpen: boolean;
	setIsOpen: any;
	isConnected: boolean;
	setIsConnected: any;
};

const TopBar = (props: TopBarProps) => {
	const title = <h1 className='text-xl'>Neo Tokyo Directory</h1>;

	const connectButton = (
		<button
			onClick={() => props.setIsConnected(!props.isConnected)}
			className={styles.connectButton}
		>
			{props.isConnected ? 'Connected' : 'Connect'}
		</button>
	);

	const hamburgerButton = (
		<button
			onClick={() => props.setIsOpen(true)}
			className={styles.hamburgerButton}
		>
			<FaBars size='20' />
		</button>
	);

	return (
		<div className={styles.container}>
			{props.isOpen ? null : hamburgerButton}
			{title}
			{connectButton}
		</div>
	);
};

export default TopBar;

const styles = {
	container:
		'relative h-16 bg-gray-900 text-cyan-400 flex justify-center items-center',
	connectButton: 'absolute top-5 right-8',
	hamburgerButton: 'absolute top-5 left-8',
};
