import OptionalFormFieldWrapper from '_styled/Forms/OptionalFormFieldWrapper';

// Note:
// useFieldArray() is for arrays of objects, not arrays of primitive types.
// Bit weird and strange and kind of shitty, seems to work fine though.
type OptionalArrayInputFieldProps = {
  fieldName: string;
  label: string;
  fields: any;
  append: any;
  remove: any;
  fieldComponents: any;
  isFieldShown: boolean;
  setIsFieldShown: any;
};
const OptionalArrayInputField = (props: OptionalArrayInputFieldProps) => {
  const addField = () => {
    if (props.fields.length > 20) return;
    props.append(`${props.fieldName} ${props.fields.length + 1}`);
  };

  const removeField = () => {
    if (props.fields.length <= 1) return;
    props.remove(props.fields.length - 1);
  };

  const fieldComponent = (
    <div className='flex flex-col gap-1'>
      {props.fieldComponents}
      <div className='flex justify-center gap-2 mt-2 text-primary'>
        <button
          className='px-3 py-1 font-bold rounded-lg bg-backgroundDark'
          onClick={addField}
          type='button'
        >
          +
        </button>
        <button
          className='px-3 py-1 font-bold rounded-lg bg-backgroundDark'
          onClick={removeField}
          type='button'
        >
          -
        </button>
      </div>
    </div>
  );

  return (
    <OptionalFormFieldWrapper
      label={props.label}
      onShowField={() => props.append(`${props.fieldName} 1`)}
      onHideField={() => props.remove()}
      formField={fieldComponent}
      isFieldShown={props.isFieldShown}
      setIsFieldShown={props.setIsFieldShown}
    />
  );
};

export default OptionalArrayInputField;
