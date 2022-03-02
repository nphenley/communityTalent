type FormFieldProps = {
  label: string;
  formField: any;
};

const FormField = (props: FormFieldProps) => {
  return (
    <div className='flex flex-col items-center gap-4 px-2 sm:gap-0 sm:flex-row'>
      <label className='text-center sm:w-1/3 text-primary'>{props.label}</label>
      {props.formField}
    </div>
  );
};

export default FormField;
