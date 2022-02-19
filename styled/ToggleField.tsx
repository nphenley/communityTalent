type ToggleFieldProps = {
  register: any;
  label: string;
  name: string;
  value?: boolean;
};

// TODO:
// Not taking default value correctly
const ToggleField = (props: ToggleFieldProps) => {
  return (
    <label className='relative flex items-center gap-4 p-2'>
      {props.label}
      <input
        type='checkbox'
        className='absolute w-full h-full -translate-x-1/2 rounded-md appearance-none left-1/2 peer'
        defaultChecked={props.value}
        {...props.register(props.name)}
      />
      <span className='w-14 h-8 flex items-center flex-shrink-0 p-1.5 bg-backgroundDark rounded-full duration-300 ease-in-out peer-checked:bg-primary after:w-6 after:h-6 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-5'></span>
    </label>
  );
};

export default ToggleField;
