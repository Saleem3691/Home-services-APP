// components/common/Input.jsx
export default function Input({
  label,
  id,
  type = "text",
  error,
  className = "",
  ...props
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-light-slate"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`block w-full px-3 py-2 bg-rich-slate border border-slate rounded-md text-lightest-slate focus:outline-none focus:ring-2 focus:ring-accent ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}