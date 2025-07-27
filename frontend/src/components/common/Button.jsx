const Button = ({ children, onClick, className, type = 'button', disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        relative overflow-hidden px-4 py-2 rounded-lg
        font-semibold text-sm transition-all duration-200 ease-smooth
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light
        ${className}
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.01] active:scale-[0.99]'}
      `}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;