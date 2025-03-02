import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large' | 'icon';

interface ButtonProps {
  onPress: () => void;
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  textClassName?: string;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  label,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  className = '',
  textClassName = '',
}) => {
  const getButtonStyle = () => {
    let baseStyles = `rounded-lg items-center justify-center flex-row ${
      fullWidth ? 'w-full' : ''
    }`;

    const sizeStyles = {
      small: 'px-3 py-1.5',
      medium: 'px-4 py-2.5',
      large: 'px-6 py-3',
      icon: 'w-14 h-14 rounded-full',
    };

    let variantStyles = '';

    switch (variant) {
      case 'primary':
        variantStyles = 'bg-blue-500 dark:bg-blue-600 active:bg-blue-600';
        break;
      case 'secondary':
        variantStyles = 'bg-gray-100 dark:bg-gray-700 active:bg-gray-200';
        break;
      case 'success':
        variantStyles = 'bg-green-500 dark:bg-green-600 active:bg-green-600';
        break;
      case 'warning':
        variantStyles = 'bg-orange-500 dark:bg-orange-600 active:bg-orange-600';
        break;
      case 'danger':
        variantStyles = 'bg-red-500 dark:bg-red-600 active:bg-red-600';
        break;
      case 'ghost':
        variantStyles =
          'bg-transparent active:bg-gray-100 dark:active:bg-gray-800';
        break;
    }

    if (disabled) {
      variantStyles = 'bg-gray-100 dark:bg-gray-800 opacity-50';
    }

    return `${baseStyles} ${sizeStyles[size]} ${variantStyles} ${className}`;
  };

  const getTextStyle = () => {
    let baseStyle = 'font-semibold';

    const sizeStyles = {
      small: 'text-xs',
      medium: 'text-sm',
      large: 'text-base',
      icon: 'text-sm',
    };

    let colorStyle = 'text-white';

    switch (variant) {
      case 'secondary':
        colorStyle = 'text-gray-900 dark:text-white';
        break;
      case 'ghost':
        colorStyle = 'text-blue-500 dark:text-blue-400';
        break;
      default:
        colorStyle = 'text-white';
    }

    if (disabled) {
      colorStyle = 'text-gray-400 dark:text-gray-500';
    }

    return `${baseStyle} ${sizeStyles[size]} ${colorStyle} ${textClassName}`;
  };

  return (
    <TouchableOpacity
      className={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'ghost' ? '#3B82F6' : '#FFFFFF'}
        />
      ) : (
        <>
          {icon && <View className={label ? 'mr-2' : ''}>{icon}</View>}
          {label && <Text className={getTextStyle()}>{label}</Text>}
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;
