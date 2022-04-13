type StyledToggleButtonProps = {
  defaultChecked?: boolean;
  onClick: any;
  size?: 'small' | 'medium';
};

const ToggleButton = (props: StyledToggleButtonProps) => {
  let labelClassName = 'grow relative flex justify-center sm:justify-start items-center text-primary';
  let spanClassName =
    'flex items-center flex-shrink-0 bg-backgroundDark rounded-full duration-300 ease-in-out peer-checked:bg-primary after:bg-backgroundLight after:rounded-full after:shadow-md after:duration-300 peer-checked:after:bg-white';

  if (props.size && props.size === 'small') {
    spanClassName += ' w-9 h-5 p-1 after:w-4 after:h-4 peer-checked:after:translate-x-3';
  } else {
    spanClassName += ' w-14 h-8 p-1.5 after:w-6 after:h-6 peer-checked:after:translate-x-5';
  }

  return (
    <label className={labelClassName}>
      <input
        type='checkbox'
        className='absolute w-full h-full -translate-x-1/2 rounded-md appearance-none left-1/2 peer focus:outline-none'
        defaultChecked={props.defaultChecked}
        onClick={props.onClick}
      />
      <span className={spanClassName} />
    </label>
  );
};

export default ToggleButton;
