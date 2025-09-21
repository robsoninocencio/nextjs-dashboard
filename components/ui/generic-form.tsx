'use client';

import { useActionState, useState, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'currency';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: string | number;
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    message?: string;
  };
}

export interface FormSection {
  title?: string;
  fields: FormField[];
}

export interface GenericFormProps {
  title: string;
  sections: FormSection[];
  action: (prevState: any, formData: FormData) => Promise<any>;
  initialState: any;
  buttonText: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
  children?: ReactNode;
}

export function GenericForm({
  title,
  sections,
  action,
  initialState,
  buttonText,
  onSuccess,
  onCancel,
  className = '',
  children,
}: GenericFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] ?? field.defaultValue ?? '';
    const fieldError = state.errors?.[field.id];

    switch (field.type) {
      case 'select':
        return (
          <select
            id={field.id}
            name={field.name}
            value={value}
            onChange={e => handleInputChange(field.id, e.target.value)}
            className={`w-full rounded-md border px-3 py-2 text-sm ${
              fieldError ? 'border-red-500' : 'border-gray-300'
            }`}
            required={field.required}
          >
            <option value=''>Selecione...</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            id={field.id}
            name={field.name}
            value={value}
            onChange={e => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={`w-full rounded-md border px-3 py-2 text-sm ${
              fieldError ? 'border-red-500' : 'border-gray-300'
            }`}
            required={field.required}
          />
        );

      case 'currency':
        return (
          <input
            type='number'
            step='0.01'
            min='0'
            id={field.id}
            name={field.name}
            value={value}
            onChange={e => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full rounded-md border px-3 py-2 text-sm ${
              fieldError ? 'border-red-500' : 'border-gray-300'
            }`}
            required={field.required}
          />
        );

      default:
        return (
          <input
            type={field.type}
            id={field.id}
            name={field.name}
            value={value}
            onChange={e => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full rounded-md border px-3 py-2 text-sm ${
              fieldError ? 'border-red-500' : 'border-gray-300'
            }`}
            required={field.required}
            pattern={field.validation?.pattern}
            min={field.validation?.min}
            max={field.validation?.max}
          />
        );
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className='space-y-6'>
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className='space-y-4'>
              {section.title && <h3 className='text-lg font-medium'>{section.title}</h3>}

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                {section.fields.map(field => {
                  const fieldError = state.errors?.[field.id];
                  return (
                    <div key={field.id} className='space-y-2'>
                      <label htmlFor={field.id} className='block text-sm font-medium text-gray-700'>
                        {field.label}
                        {field.required && <span className='text-red-500'>*</span>}
                      </label>

                      {renderField(field)}

                      {fieldError && <p className='text-sm text-red-600'>{fieldError}</p>}

                      {field.validation?.message && (
                        <p className='text-xs text-gray-500'>{field.validation.message}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {children}

          {/* Error/Success Messages */}
          {state.message && (
            <div
              className={`p-4 rounded-md ${
                state.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className='flex items-center'>
                {state.success ? (
                  <CheckCircle2 className='h-4 w-4 text-green-600 mr-2' />
                ) : (
                  <AlertCircle className='h-4 w-4 text-red-600 mr-2' />
                )}
                <p className={`text-sm ${state.success ? 'text-green-800' : 'text-red-800'}`}>
                  {state.message}
                </p>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className='flex justify-end space-x-4 pt-4'>
            {onCancel && (
              <Button type='button' variant='outline' onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type='submit' disabled={state.loading}>
              {state.loading ? 'Processando...' : buttonText}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Hook para gerenciar estado do formulário
export function useFormState<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);

  const updateField = (field: keyof T, value: any) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const reset = () => {
    setState(initialState);
  };

  return { state, updateField, reset, setState };
}
