interface inputProp {
  placeholder: string;
  type: string;
  required: boolean;
  reference?: any;
  extraClasses?: string;
}

const InputBox = (props: inputProp) => {
  return (
    <input
      required={props.required}
      ref={props.reference}
      className={`w-[90%] border py-2 outline-none shadow-lg px-3 rounded-md ${props.extraClasses}` }
      type={props.type}
      placeholder={props.placeholder}
    />
  );
};

export default InputBox;
