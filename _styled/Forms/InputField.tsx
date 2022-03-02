type InputFieldProps = {
  register: any;
  placeholder: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  maxLength: number;
};

const InputField = (props: InputFieldProps) => {
  return (
    <input
      className='grow p-3 rounded-lg sm:w-fit bg-backgroundDark focus:outline-none'
      placeholder={props.placeholder}
      defaultValue={props.defaultValue}
      maxLength={props.maxLength}
      {...props.register(props.name, {
        required: props.required,
        maxLength: props.maxLength,
      })}
    />
  );
};

export default InputField;
