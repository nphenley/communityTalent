type LargeInputFieldProps = {
  register: any;
  placeholder: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  maxLength: number;
};

const LargeInputField = (props: LargeInputFieldProps) => {
  return (
    <textarea
      className='w-full p-5 rounded-lg resize-none sm:w-fit grow h-60 sm:h-40 bg-backgroundDark focus:outline-none'
      placeholder={props.placeholder}
      maxLength={props.maxLength}
      defaultValue={props.defaultValue}
      {...props.register(props.name, {
        required: props.required,
        maxLength: props.maxLength,
      })}
    />
  );
};

export default LargeInputField;
