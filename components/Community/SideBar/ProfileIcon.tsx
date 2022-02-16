type ProfileIconProps = {
  icon: any;
};

const ProfileIcon = (props: ProfileIconProps) => (
  <footer className='hover:bg-cyan-700 hover:rounded-md p-3'>
    {props.icon}
  </footer>
);

export default ProfileIcon;
