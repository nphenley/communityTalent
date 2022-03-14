type FormSubmitProps = {
  text?: string;
};
const FormSubmit = (props: FormSubmitProps) => {
  return (
    <button
      className='p-4 text-white rounded-lg bg-primary hover:bg-primaryLight hover:cursor-pointer'
      type='submit'
    >
      {props.text ? props.text : 'Submit'}
    </button>
  );
};

export default FormSubmit;
