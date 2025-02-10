'use client';

import clsx from 'clsx';

interface SelectProps {
  label: string;
  id: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  id,
  options,
  defaultValue,
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
        <select
          id={id}
          defaultValue={defaultValue}
          {...props}
          className={clsx(
            `
            items-center
            justify-center
            text-center
            flex
            h-full
            w-full
            rounded-xl
            border-0
            py-1.5
            shadow-sm
            ring-1
            px-2
            ring-inset
            ring-gray-300
            placeholder:text-gray-400
            focus:outline-2
            focus:ring-2
            focus:ring-blue-500
            sm:text-sm
            sm:leading-6
            bg-white
            `
          )}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Select;
