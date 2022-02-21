type StyledButtonProps = {
  text: string;
  onClick: any;
};

const StyledButton = (props: StyledButtonProps) => {
  return (
    <button onClick={props.onClick} className={styles.container}>
      {props.text}
    </button>
  );
};

export default StyledButton;

const styles = {
  container:
    'bg-primary p-5 text-white rounded-lg font-bold uppercase text-xl hover:bg-primaryLight',
};
