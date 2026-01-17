interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export default function LoadingSpinner({ 
  size = 'medium', 
  color = 'text-deepseek-green' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} ${color}`}>
        <div className="animate-spin">
          <div className="h-full w-full rounded-full border-2 border-t-transparent border-current"></div>
        </div>
      </div>
    </div>
  );
}
