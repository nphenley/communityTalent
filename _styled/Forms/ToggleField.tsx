type StyledToggleFieldProps = {
  register: any;
  label: string;
  name: string;
  defaultChecked?: boolean;
};

const ToggleField = (props: StyledToggleFieldProps) => {
  return (
    <label className='grow relative flex justify-center sm:justify-start items-center px-2 text-primary my-2 sm:my-0'>
      <input
        type='checkbox'
        className='absolute w-full h-full -translate-x-1/2 rounded-md appearance-none left-1/2 peer focus:outline-none'
        defaultChecked={props.defaultChecked}
        {...props.register(props.name)}
      />
      <span className='w-14 h-8 flex items-center flex-shrink-0 p-1.5 bg-backgroundDark rounded-full duration-300 ease-in-out peer-checked:bg-primary after:w-6 after:h-6 after:bg-backgroundLight after:rounded-full after:shadow-md after:duration-300 peer-checked:after:bg-white peer-checked:after:translate-x-5'></span>
    </label>
  );
};

export default ToggleField;
