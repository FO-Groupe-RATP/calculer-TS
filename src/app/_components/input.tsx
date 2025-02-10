'use client';

import clsx from 'clsx';

interface InputProps {
  label: string;
  id: string;
  type: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  type,
  value,
  onChange,
  ...props
}) => {
  return (
    <div className="flex items-center justify-start w-full h-full max-sm:flex-col">
      <label
        className=" 
          text-sm
          font-bold
          items-center
          max-sm:justify-center
          justify-start
          flex
          h-full
          w-[50%]
        "
        htmlFor={id}
      >
        {label}
      </label>
      <div className="justify-center flex h-full w-full items-center">
        <input
          id={id}
          min="0"
          type={type}
          value={value}
          onChange={onChange}
          {...props}
          className={clsx(
            `
          items-center
          justify-center
          flex
          h-full
          w-full
          px-2
          text-center
          rounded-xl
          border-0
          py-1.5
          shadow-sm
          ring-1
          ring-inset
          ring-gray-300
          placeholder:text-gray-400
          focus:outline-2
          sm:text-sm
          sm:leading-6`
          )}
        />
      </div>
    </div>
  );
};

export default Input;
