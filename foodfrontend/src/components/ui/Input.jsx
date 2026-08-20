import { cn } from '../../utils/helpers';

export const Input = ({
  label,
  type = 'text',
  name,
  id,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  disabled = false,
  required = false,
  className = '',
  inputClassName = '',
  ...props
}) => {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label htmlFor={id || name} className="input-label">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          id={id || name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={cn(
            'input-field',
            icon && iconPosition === 'left' && 'pl-11',
            icon && iconPosition === 'right' && 'pr-11',
            error && 'border-danger-500 focus:ring-danger-500/30 focus:border-danger-500',
            inputClassName
          )}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400">
            {icon}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-danger-500">{error}</p>}
      {helperText && !error && <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
};

export const Textarea = ({
  label,
  name,
  id,
  placeholder,
  value,
  onChange,
  error,
  rows = 4,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label htmlFor={id || name} className="input-label">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        name={name}
        id={id || name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        disabled={disabled}
        required={required}
        className={cn(
          'input-field resize-none',
          error && 'border-danger-500 focus:ring-danger-500/30 focus:border-danger-500',
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-danger-500">{error}</p>}
    </div>
  );
};

export const Select = ({
  label,
  name,
  id,
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  error,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label htmlFor={id || name} className="input-label">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      <select
        name={name}
        id={id || name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={cn(
          'input-field appearance-none bg-no-repeat bg-right pr-10 cursor-pointer',
          error && 'border-danger-500 focus:ring-danger-500/30 focus:border-danger-500',
        )}
        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt, i) => (
          <option key={i} value={typeof opt === 'object' ? opt.value : opt}>
            {typeof opt === 'object' ? opt.label : opt}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-sm text-danger-500">{error}</p>}
    </div>
  );
};

export const Checkbox = ({
  label,
  checked,
  onChange,
  name,
  id,
  disabled = false,
  className = '',
  error,
}) => {
  return (
    <div className={cn('flex items-start', className)}>
      <div className="flex items-center h-5">
        <input
          id={id || name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="w-5 h-5 rounded-lg border-slate-300 dark:border-slate-600 text-primary-500 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer disabled:opacity-50"
        />
      </div>
      <div className="ml-3">
        <label htmlFor={id || name} className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
          {label}
        </label>
        {error && <p className="mt-1 text-sm text-danger-500">{error}</p>}
      </div>
    </div>
  );
};

export const Toggle = ({
  label,
  checked,
  onChange,
  disabled = false,
  description,
  className = '',
}) => {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex-1">
        {label && <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</p>}
        {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          checked ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
};
