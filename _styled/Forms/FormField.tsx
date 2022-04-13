type FormFieldProps = {
  label: string;
  formField: any;
};

const FormField = (props: FormFieldProps) => {
  return (
    <div className='flex flex-col items-center gap-4 sm:gap-0 sm:flex-row'>
      <label className='w-1/3 text-center text-primary'>{props.label}</label>
      <div className='w-2/3'>{props.formField}</div>
    </div>
  );
};

export default FormField;
