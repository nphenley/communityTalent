import { Controller } from 'react-hook-form';
import Select from 'react-select';

type SelectFieldSingleProps = {
  control: any;
  name: string;
  label: string;
  options: any;
  required: boolean;
};

const SelectFieldSingle = (props: SelectFieldSingleProps) => {
  const onValueChange = (e: any, onChange: any) => {
    return onChange(e.value);
  };

  return (
    <Controller
      control={props.control}
      name={props.name}
      render={({ field: { onChange } }) => (
        <Select
          className='grow'
          classNamePrefix='select-field'
          onChange={(e) => onValueChange(e, onChange)}
          options={props.options}
        />
      )}
    />
  );
};

export default SelectFieldSingle;
