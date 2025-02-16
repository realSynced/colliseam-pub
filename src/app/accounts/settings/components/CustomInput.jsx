import { useRef } from "react";

const CustomInput = ({ children, title, desc, value, setValue, type = "text", edit, readOnly, isTextarea }) => {
  const inputRef = useRef(null);

  function focusInput() {
    inputRef?.current.focus();
  }
  return (
    <div className="flex">
      <div className="w-96">
        <h1 className="text-base font-semibold">{title}</h1>
        <p className="text-xs font-medium text-white/75">{desc}</p>
      </div>

      {/* For custom inputs -- banner, avatar etc */}
      {children}

      {/* For normal inputs/textareas */}
      {!children && (
        <div className="flex gap-3">
          {/* If isTextarea */}
          {isTextarea && (
            <textarea
              value={value}
              className="w-60 resize-none rounded-xl border border-transparent bg-blackLight px-4 py-2 outline-none duration-200 placeholder:text-white/50 focus:border-white/50"
              onChange={(e) => setValue(!readOnly ? e.target.value : "")}
              type="text"
              ref={inputRef}
              disabled={readOnly}
              rows={3}
            />
          )}

          {/* If it is not isTextarea / for normal inputs */}
          {!isTextarea && (
            <input
              value={value}
              className="w-60 rounded-full border border-transparent bg-blackLight px-4 py-2 outline-none duration-200 placeholder:text-white/50 focus:border-white/50"
              onChange={(e) => setValue(!readOnly ? e.target.value : "")}
              type={type}
              ref={inputRef}
              disabled={readOnly}
            />
          )}

          <label onClick={focusInput}>
            {/* If we want somethin custom instead of edit icon */}
            {edit}

            {/* Default Edit Icon */}
            {!edit && (
              <svg
                className="box-content cursor-pointer rounded-full stroke-white/75 p-2 duration-200 hover:bg-blackLight hover:stroke-white"
                width="26"
                height="26"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.173 10.4274L25.573 15.8274M6.6731 29.3274L13.2221 28.0078C13.5697 27.9378 13.889 27.7666 14.1397 27.5157L28.8002 12.8472C29.5031 12.1439 29.5026 11.0039 28.7991 10.3012L25.6935 7.1991C24.9903 6.49669 23.8509 6.49717 23.1483 7.20016L8.48624 21.8702C8.23602 22.1206 8.06517 22.4392 7.99505 22.7861L6.6731 29.3274Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </label>
        </div>
      )}
    </div>
  );
};

export default CustomInput;
