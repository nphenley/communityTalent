type SearchBarProps = {
  onChange: any;
  placeholder: string;
};
const SearchBar = (props: SearchBarProps) => {
  return (
    <input
      className='w-full p-4 text-white rounded-lg grow focus:outline-none lg:max-w-sm bg-backgroundDark'
      onChange={props.onChange}
      placeholder={props.placeholder}
    />
  );
};

export default SearchBar;
