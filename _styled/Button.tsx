type ButtonProps = {
  text: string;
  onClick: any;
};

const Button = (props: ButtonProps) => {
  return (
    <button onClick={props.onClick} className={styles.container}>
      {props.text}
    </button>
  );
};

export default Button;

const styles = {
  container: 'bg-primary p-5 text-white rounded-lg font-bold uppercase text-xl hover:bg-primaryDark',
};
