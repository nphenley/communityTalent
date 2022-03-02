import { Controller } from 'react-hook-form';
import Select from 'react-select';

// Using react-select, so can only style <Select /> without tailwind, in globals.css

// TODO:
// Stuff not wrapping properly, container grows horizontally.

type SelectFieldProps = {
  control: any;
  name: string;
  label: string;
  options: any;
  defaultValues?: string[];
};

const SelectField = (props: SelectFieldProps) => {
  const onValueChange = (e: any, onChange: any) => {
    let values = [];
    for (const obj of e) values.push(obj.value);
    return onChange(values);
  };

  const defaultValues = props.defaultValues
    ? props.defaultValues.map((val) => {
        return {
          value: val,
          label: val,
        };
      })
    : [];

  return (
    <div className='flex flex-col items-center gap-4 px-2 sm:gap-0 sm:flex-row'>
      <label className='text-center sm:w-1/3 text-primary'>{props.label}</label>

      <Controller
        control={props.control}
        name={props.name}
        render={({ field: { onChange } }) => (
          <Select
            className='grow'
            classNamePrefix='select-field'
            onChange={(e) => onValueChange(e, onChange)}
            options={props.options}
            isMulti
            defaultValue={defaultValues}
          />
        )}
      />
    </div>
  );
};

export default SelectField;
