type InputFieldProps = {
  register: any;
  label: string;
  name: string;
  defaultValue?: string;
  required: boolean;
  maxLength: number;
};

const InputField = (props: InputFieldProps) => {
  return (
    <div className='flex flex-col items-center gap-4 px-2 sm:gap-0 sm:flex-row'>
      <label className='text-center sm:w-1/3 text-primary'>{props.label}</label>
      <input
        className='w-full p-3 rounded-lg sm:w-fit grow bg-backgroundDark'
        placeholder={props.label}
        defaultValue={props.defaultValue}
        maxLength={props.maxLength}
        {...props.register(props.name, {
          required: props.required,
          maxLength: props.maxLength,
        })}
      />
    </div>
  );
};

export default InputField;
