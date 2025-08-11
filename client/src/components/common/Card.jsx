import React from 'react';

const Card = ({
  children,
  className = '',
  padding = 'p-6',
  shadow = 'shadow-md',
  border = 'border border-gray-200',
  hover = false,
  ...props
}) => {
  const baseClasses = 'bg-white rounded-lg';
  const hoverClass = hover ? 'hover:shadow-lg transition-shadow duration-200' : '';
  
  const classes = [
    baseClasses,
    padding,
    shadow,
    border,
    hoverClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// Card Header component
export const CardHeader = ({ 
  children, 
  className = '',
  border = 'border-b border-gray-200',
  padding = 'pb-4 mb-4'
}) => {
  const classes = [border, padding, className].filter(Boolean).join(' ');
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
};

// Card Title component
export const CardTitle = ({ 
  children, 
  className = '',
  size = 'lg'
}) => {
  const sizes = {
    sm: 'text-sm font-medium',
    md: 'text-base font-medium',
    lg: 'text-lg font-semibold',
    xl: 'text-xl font-bold'
  };

  const classes = [
    'text-gray-900',
    sizes[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <h3 className={classes}>
      {children}
    </h3>
  );
};

// Card Subtitle component
export const CardSubtitle = ({ 
  children, 
  className = ''
}) => {
  const classes = [
    'text-sm text-gray-600 mt-1',
    className
  ].filter(Boolean).join(' ');

  return (
    <p className={classes}>
      {children}
    </p>
  );
};

// Card Content component
export const CardContent = ({ 
  children, 
  className = ''
}) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

// Card Footer component
export const CardFooter = ({ 
  children, 
  className = '',
  border = 'border-t border-gray-200',
  padding = 'pt-4 mt-4'
}) => {
  const classes = [border, padding, className].filter(Boolean).join(' ');
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
};

// Stats Card variant
export const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendValue,
  className = ''
}) => {
  const getTrendColor = (trend) => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return '↗';
    if (trend === 'down') return '↘';
    return '→';
  };

  return (
    <Card className={className}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center text-sm ${getTrendColor(trend)}`}>
              <span className="mr-1">{getTrendIcon(trend)}</span>
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-blue-100 rounded-full">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

// Feature Card variant
export const FeatureCard = ({ 
  title, 
  description, 
  icon, 
  action,
  className = ''
}) => {
  return (
    <Card className={`text-center ${className}`}>
      {icon && (
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <CardTitle size="md" className="mb-2">{title}</CardTitle>
      <CardSubtitle className="mb-4">{description}</CardSubtitle>
      {action && (
        <div className="mt-auto">
          {action}
        </div>
      )}
    </Card>
  );
};

export default Card; 
