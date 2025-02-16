interface AlertProps {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'error' | 'success';
}

const alertStyles = {
  info: 'bg-blue-100 border-blue-500 text-blue-900',
  warning: 'bg-yellow-100 border-yellow-500 text-yellow-900',
  error: 'bg-red-100 border-red-500 text-red-900',
  success: 'bg-green-100 border-green-500 text-green-900',
};

export function Alert({ children, type = 'info' }: AlertProps) {
  return (
    <div className={`my-4 rounded-lg border-l-4 p-4 ${alertStyles[type]}`}>
      {children}
    </div>
  );
}
