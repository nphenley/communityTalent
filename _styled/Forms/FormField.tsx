type FormFieldProps = {
  label: string;
  formField: any;
};

const FormField = (props: FormFieldProps) => {
  return (
    <div className='flex flex-col items-center w-full gap-4 sm:gap-0 sm:flex-row'>
      <label className='w-1/4 text-center sm:w-1/3 text-primary'>{props.label}</label>
      <div className='w-3/4 grow'>{props.formField}</div>
    </div>
  );
};

export default FormField;
