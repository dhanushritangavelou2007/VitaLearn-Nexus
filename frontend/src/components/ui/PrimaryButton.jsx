function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-blue-600 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-xl ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default PrimaryButton;
