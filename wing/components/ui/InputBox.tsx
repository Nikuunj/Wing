interface InputBoxProps {
  refrence: (instance: HTMLInputElement | HTMLTextAreaElement | null) => void;
  placeHolder: string;
  typeOfIn: "text" | "password" | "email" | "number" | 'textarea';
  defaultVal?: string;
}

function InputBox({ refrence, placeHolder, typeOfIn, defaultVal }: InputBoxProps) {
  const commonClasses = "text-gray-300 px-4 py-3 min-w-72 rounded-md cursor-text border lg:w-full border-dashed border-zinc-700 outline-0";

  return (
    <div className="relative w-fit lg:w-full">
      {typeOfIn === 'textarea' ? (
        <textarea
          ref={refrence as (instance: HTMLTextAreaElement | null) => void}
          className={`${commonClasses} resize-none min-h-24 no-scrollbar`}
          placeholder={placeHolder}
          defaultValue={defaultVal}
        />
      ) : (
        <input
          type={typeOfIn}
          ref={refrence as (instance: HTMLInputElement | null) => void}
          className={commonClasses}
          placeholder={placeHolder}
          defaultValue={defaultVal}
        />
      )}
      <div className="absolute w-1.5 h-1.5 top-0 left-0 border-t border-l" />
      <div className="absolute w-1.5 h-1.5 top-0 right-0 border-t border-r" />
      <div className="absolute w-1.5 h-1.5 bottom-0 left-0 border-b border-l" />
      <div className="absolute w-1.5 h-1.5 bottom-0 right-0 border-b border-r" />
    </div>
  );
}

export default InputBox;
