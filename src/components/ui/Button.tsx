import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    className = '',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled,
    children,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

    // Using CSS variables for radius (will inherit from global or can be explicit if needed, but 'rounded-lg' usually maps to tailwind config which might map to variables if configured, 
    // but here we are using standard tailwind classes. To ensure we match the new global variables, we might need custom classes or rely on the fact that we updated index.css
    // However, tailwind classes like 'rounded-lg' are fixed unless customized involved. 
    // Given the setup, I will use standard matching tailwind classes that likely correspond to the design intention, 
    // or use inline styles for genericizing if tailwind config isn't available to check.
    // Specifying 'rounded-[var(--radius-md)]' ensures usage of the variable.
    const radiusStyle = "rounded-[var(--radius-md)]";

    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md active:transform active:scale-95",
        secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md active:bg-gray-100",
        danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md active:transform active:scale-95",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };

    return (
        <button
            className={`${baseStyles} ${radiusStyle} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </button>
    );
};
