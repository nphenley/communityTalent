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
      className='w-full p-3 rounded-lg bg-backgroundDark focus:outline-none'
      placeholder={props.placeholder}
      defaultValue={props.defaultValue}
      maxLength={props.maxLength}
      {...props.register(props.name, {
        required: props.required ? `Please submit a ${props.placeholder}.` : false,
        maxLength: props.maxLength,
      })}
    />
  );
};

export default InputField;
