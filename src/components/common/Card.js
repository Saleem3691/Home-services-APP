export default function Card({
  children,
  className = "",
  variant = "default",
  ...props
}) {
  const variants = {
    default: "bg-deep-navy",
    secondary: "bg-rich-slate",
    accent: "bg-accent",
  };

  return (
    <div
      className={`rounded-lg shadow-lg p-6 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
