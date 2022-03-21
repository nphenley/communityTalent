import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

type ProfilePicProps = {
  userNftImages: string[];
  control: any;
  defaultValue?: string;
  register: any;
  placeholder?: string;
  name: string;
};

export const ProfilePicField = (props: ProfilePicProps) => {
  const [active, setActive] = useState('');

  useEffect(() => {
    if (!props.defaultValue) return;
    setActive(props.defaultValue);
  }, []);

  return (
    <div className='p-3 rounded-lg grow sm:w-fit bg-backgroundDark focus:outline-none'>
      <Controller
        control={props.control}
        name={props.name}
        render={({ field: { onChange } }) => (
          <div className='grid grid-flow-row grid-cols-4 gap-2'>
            {props.userNftImages.map((image: string) => (
              <div key={image}>
                <UserNftImageIcon
                  setActive={setActive}
                  onChange={onChange}
                  image={image}
                  active={active}
                  name={props.name}
                />
              </div>
            ))}
          </div>
        )}
      />
    </div>
  );
};

type UserNftImageIconProps = {
  image: string;
  active: string;
  setActive: any;
  onChange: any;
  name: string;
};

const UserNftImageIcon = (props: UserNftImageIconProps) => {
  const onValueChange = (image: any, onChange: any) => {
    props.setActive(image.target.src);
    return onChange(image.target.src);
  };
  let imageIconClasses = 'flex justify-center overflow-hidden rounded-full';
  imageIconClasses +=
    props.active === props.image ? ' border-2 border-pink-500' : '';
  return (
    <button
      onClick={(image) => onValueChange(image, props.onChange)}
      type='button'
    >
      <div className={imageIconClasses}>
        <img src={props.image} height={150} width={150} placeholder={'blur'} />
      </div>
    </button>
  );
};
