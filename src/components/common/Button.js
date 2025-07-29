// components/common/Button.jsx
import { forwardRef } from 'react';
import clsx from 'clsx';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const variants = {
    primary: 'bg-rich-slate text-white hover:bg-slate-700 border border-transparent',
    secondary: 'bg-white text-rich-slate hover:bg-slate-50 border border-rich-slate',
    outline: 'bg-transparent text-rich-slate hover:bg-slate-50 border border-rich-slate',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      ref={ref}
      className={clsx(
        'rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rich-slate',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;