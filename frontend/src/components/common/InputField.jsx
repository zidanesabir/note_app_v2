const InputField = ({ label, id, type, value, onChange, required = false, className, placeholder, icon }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-neutral-800 text-sm font-medium mb-1">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 text-lg">
            {icon}
          </span>
        )}
        <input
          type={type}
          id={id}
          className={`
            block w-full px-3 py-2 border border-neutral-200 rounded-lg
            shadow-sm placeholder-neutral-400
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
            sm:text-sm
            ${icon ? 'pl-10' : ''}
            ${className}
          `}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default InputField;