import { ButtonHTMLAttributes } from 'react';

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string
}

export default function LoadingButton({
  isLoading = false,
  children,
  disabled,
  className,
  loadingText,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      disabled={isLoading || disabled}
      className={
        `px-4 py-2 rounded text-white flex items-center justify-center gap-2 
        hover:scale-105 active:scale-95 hover:shadow-lg transition-transform duration-200 
        ${isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} 
        ${className || ''}`
      }
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {isLoading ? loadingText || 'Processing...' : children}
    </button>
  );
}
