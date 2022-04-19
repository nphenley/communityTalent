import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

type ProfilePicProps = {
  imageOptions: string[];
  control: any;
  defaultValue?: string;
  placeholder?: string;
  name: string;
};

export const ImageSelectField = (props: ProfilePicProps) => {
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
        defaultValue={props.imageOptions[0]}
        render={({ field: { onChange } }) => (
          <div className='grid grid-flow-row grid-cols-4 gap-2'>
            {props.imageOptions.map((image: string) => (
              <div key={image}>
                <ImageIcon setActive={setActive} onChange={onChange} image={image} active={active} name={props.name} />
              </div>
            ))}
          </div>
        )}
      />
    </div>
  );
};

type ImageIconProps = {
  image: string;
  active: string;
  setActive: any;
  onChange: any;
  name: string;
};

const ImageIcon = (props: ImageIconProps) => {
  const onValueChange = (image: any, onChange: any) => {
    props.setActive(image.target.src);
    return onChange(image.target.src);
  };
  let imageIconClasses = 'flex justify-center overflow-hidden rounded-full';
  imageIconClasses += props.active === props.image ? ' border-2 border-pink-500' : '';
  return (
    <button onClick={(image) => onValueChange(image, props.onChange)} type='button'>
      <div className={imageIconClasses}>
        <img src={props.image} height={150} width={150} placeholder={'blur'} />
      </div>
    </button>
  );
};
