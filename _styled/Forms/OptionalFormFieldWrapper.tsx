type OptionalFormFieldWrapperProps = {
  formField: any;
  onShowField?: any;
  onHideField?: any;
  label: string;
  isFieldShown: boolean;
  setIsFieldShown: any;
};
const OptionalFormFieldWrapper = (props: OptionalFormFieldWrapperProps) => {
  const hideField = () => {
    props.setIsFieldShown(false);
    if (props.onHideField) props.onHideField();
  };

  const showField = () => {
    props.setIsFieldShown(true);
    if (props.onShowField) props.onShowField();
  };

  return (
    <div className='relative'>
      {props.isFieldShown ? (
        <>
          {props.formField}
          <button
            className='absolute text-3xl font-bold rounded-lg -top-2 sm:-top-1 right-5 text-backgroundLight'
            onClick={hideField}
          >
            -
          </button>
        </>
      ) : (
        <div
          onClick={showField}
          className='p-6 mx-2 font-bold text-center border-2 border-dashed rounded-lg border-backgroundLight hover:cursor-pointer text-backgroundLight'
        >
          + {props.label}
        </div>
      )}
    </div>
  );
};

export default OptionalFormFieldWrapper;
