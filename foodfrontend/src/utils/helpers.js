export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'fresh':
      return {
        bg: 'bg-success-500',
        bgLight: 'bg-success-50 dark:bg-success-500/15',
        text: 'text-success-700 dark:text-success-400',
        border: 'border-success-200 dark:border-success-500/30',
        gradient: 'from-success-400 to-success-600',
        hex: '#22C55E',
      };
    case 'moderate':
      return {
        bg: 'bg-accent-500',
        bgLight: 'bg-accent-50 dark:bg-accent-500/15',
        text: 'text-accent-700 dark:text-accent-400',
        border: 'border-accent-200 dark:border-accent-500/30',
        gradient: 'from-accent-400 to-accent-600',
        hex: '#F59E0B',
      };
    case 'spoiled':
      return {
        bg: 'bg-danger-500',
        bgLight: 'bg-danger-50 dark:bg-danger-500/15',
        text: 'text-danger-700 dark:text-danger-400',
        border: 'border-danger-200 dark:border-danger-500/30',
        gradient: 'from-danger-400 to-danger-600',
        hex: '#EF4444',
      };
    default:
      return {
        bg: 'bg-secondary-500',
        bgLight: 'bg-secondary-50 dark:bg-secondary-500/15',
        text: 'text-secondary-700 dark:text-secondary-400',
        border: 'border-secondary-200 dark:border-secondary-500/30',
        gradient: 'from-secondary-400 to-secondary-600',
        hex: '#2563EB',
      };
  }
};

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const checkPasswordStrength = (password) => {
  let strength = 0;
  let feedback = [];

  if (password.length >= 8) {
    strength += 1;
  } else {
    feedback.push('At least 8 characters');
  }

  if (/[A-Z]/.test(password)) {
    strength += 1;
  } else {
    feedback.push('One uppercase letter');
  }

  if (/[a-z]/.test(password)) {
    strength += 1;
  } else {
    feedback.push('One lowercase letter');
  }

  if (/[0-9]/.test(password)) {
    strength += 1;
  } else {
    feedback.push('One number');
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    strength += 1;
  } else {
    feedback.push('One special character');
  }

  let label = 'Weak';
  let color = 'bg-danger-500';

  if (strength >= 5) {
    label = 'Very Strong';
    color = 'bg-success-500';
  } else if (strength >= 4) {
    label = 'Strong';
    color = 'bg-primary-500';
  } else if (strength >= 3) {
    label = 'Good';
    color = 'bg-accent-500';
  } else if (strength >= 2) {
    label = 'Fair';
    color = 'bg-orange-500';
  }

  return {
    score: strength,
    label,
    color,
    feedback,
    percentage: (strength / 5) * 100,
  };
};

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getRelativeTime = (timestamp) => {
  const now = new Date();
  const then = new Date(timestamp);
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 7) return formatDate(timestamp);
  if (days > 1) return `${days} days ago`;
  if (days === 1) return 'Yesterday';
  if (hours > 1) return `${hours} hours ago`;
  if (hours === 1) return '1 hour ago';
  if (minutes > 1) return `${minutes} minutes ago`;
  return 'Just now';
};

export const generateId = () => Math.random().toString(36).substring(2, 11);

export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};
