'use client';

import { ChangeEvent, useState } from 'react';
import CustomCurrencyInput from '@/components/shared/currency-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Componente para exibir erros de validação de um campo
export function InputError({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return (
    <div className='mt-2 text-sm text-red-500'>
      {errors.map(error => (
        <p key={error}>{error}</p>
      ))}
    </div>
  );
}

// Componente genérico para campos de seleção (select)
export function SelectField({
  id,
  label,
  options,
  defaultValue,
  errors,
  onChange,
  icon: Icon,
}: {
  id: string;
  label: string;
  options: { id: string; name: string }[];
  defaultValue?: string;
  errors?: string[];
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  icon: React.ElementType;
}) {
  const [value, setValue] = useState(defaultValue ?? '');

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    if (onChange) {
      // Simulate ChangeEvent
      const event = {
        target: { value: newValue },
      } as ChangeEvent<HTMLSelectElement>;
      onChange(event);
    }
  };

  return (
    <div>
      <Label htmlFor={id} className='mb-2 block text-sm font-medium'>
        {label}
      </Label>
      <div className='relative'>
        <Select value={value} onValueChange={handleValueChange}>
          <SelectTrigger className={`w-full ${errors?.length ? 'border-red-500' : ''}`}>
            <div className='flex items-center'>
              <Icon className='h-4 w-4 mr-2' />
              <SelectValue placeholder={`Selecione o ${label.toLowerCase()}`} />
            </div>
          </SelectTrigger>
          <SelectContent>
            {options.map(option => (
              <SelectItem key={option.id} value={option.id}>
                {id === 'mes' ? `${option.id} - ${option.name}` : option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Hidden input to include in form data */}
        <input type='hidden' name={id} value={value} />
      </div>
      <div id={`${id}-error`} aria-live='polite' aria-atomic='true'>
        <InputError errors={errors} />
      </div>
    </div>
  );
}

// Componente genérico para campos de moeda
export function CurrencyField({
  id,
  label,
  placeholder,
  defaultValue,
  errors,
}: {
  id: string;
  label: string;
  placeholder: string;
  defaultValue?: string | number;
  errors?: string[];
}) {
  return (
    <div>
      <Label htmlFor={id} className='mb-2 block text-sm font-medium'>
        {label}
      </Label>
      <div className='relative'>
        <CustomCurrencyInput
          id={id}
          name={id}
          placeholder={placeholder}
          defaultValue={defaultValue}
          aria-describedby={`${id}-error`}
          hasError={!!errors?.length}
        />
      </div>
      <div id={`${id}-error`} aria-live='polite' aria-atomic='true'>
        <InputError errors={errors} />
      </div>
    </div>
  );
}
