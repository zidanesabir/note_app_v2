import { useState, useEffect } from 'react';

const Notification = ({ message, type = 'info', duration = 4000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  let bgColor;
  let textColor = 'text-white';

  switch (type) {
    case 'success':
      bgColor = 'bg-green-500';
      break;
    case 'error':
      bgColor = 'bg-red-500';
      break;
    case 'warning':
      bgColor = 'bg-yellow-500';
      textColor = 'text-neutral-800';
      break;
    case 'info':
    default:
      bgColor = 'bg-primary';
      break;
  }

  return (
    <div className={`${bgColor} ${textColor} p-3 rounded-lg text-sm text-center animate-slide-in`}>
      {message}
    </div>
  );
};

export default Notification;