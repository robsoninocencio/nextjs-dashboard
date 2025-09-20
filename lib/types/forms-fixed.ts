import { z } from "zod";
import type { ReactNode } from "react";

// Tipos base para formulários
export interface BaseFormData {
  [key: string]: any;
}

export interface FormValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface FormState {
  data?: BaseFormData;
  errors?: FormValidationError[];
  message?: string;
  success?: boolean;
  isLoading?: boolean;
}

// Tipos para campos de formulário
export interface BaseFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  placeholder?: string;
  description?: string;
  defaultValue?: any;
}

export interface TextFieldConfig extends BaseFieldConfig {
  type: "text" | "email" | "password" | "url" | "tel";
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
  decimalPlaces?: number;
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select" | "multiselect";
  options: SelectOption[];
  searchable?: boolean;
  clearable?: boolean;
}

export interface DateFieldConfig extends BaseFieldConfig {
  type: "date" | "datetime" | "time";
  minDate?: Date | string;
  maxDate?: Date | string;
}

export interface TextareaFieldConfig extends BaseFieldConfig {
  type: "textarea";
  rows?: number;
  minLength?: number;
  maxLength?: number;
}

export interface CurrencyFieldConfig extends BaseFieldConfig {
  type: "currency";
  currency?: string;
  locale?: string;
  min?: number;
  max?: number;
}

export interface FileFieldConfig extends BaseFieldConfig {
  type: "file";
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // em bytes
  maxFiles?: number;
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: "checkbox";
  checkedValue?: any;
  uncheckedValue?: any;
}

export interface RadioFieldConfig extends BaseFieldConfig {
  type: "radio";
  options: SelectOption[];
}

export interface SwitchFieldConfig extends BaseFieldConfig {
  type: "switch";
  checkedText?: string;
  uncheckedText?: string;
}

export interface HiddenFieldConfig extends BaseFieldConfig {
  type: "hidden";
}

// União de todos os tipos de campo
export type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | SelectFieldConfig
  | DateFieldConfig
  | TextareaFieldConfig
  | CurrencyFieldConfig
  | FileFieldConfig
  | CheckboxFieldConfig
  | RadioFieldConfig
  | SwitchFieldConfig
  | HiddenFieldConfig;

// Tipos auxiliares
export type FieldType =
  | "text"
  | "email"
  | "password"
  | "url"
  | "tel"
  | "number"
  | "select"
  | "multiselect"
  | "date"
  | "datetime"
  | "time"
  | "textarea"
  | "currency"
  | "file"
  | "checkbox"
  | "radio"
  | "switch"
  | "hidden";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  group?: string;
  icon?: ReactNode;
}

export interface FieldGroup {
  title?: string;
  description?: string;
  fields: FieldConfig[];
  columns?: 1 | 2 | 3 | 4;
  collapsible?: boolean;
  collapsed?: boolean;
}

// Configuração completa do formulário
export interface FormConfig {
  fields: FieldConfig[] | FieldGroup[];
  layout?: "vertical" | "horizontal" | "inline";
  columns?: 1 | 2 | 3 | 4;
  submitButton?: {
    label?: string;
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
    size?: "sm" | "md" | "lg";
    icon?: ReactNode;
    disabled?: boolean;
  };
  cancelButton?: {
    label?: string;
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
    size?: "sm" | "md" | "lg";
    icon?: ReactNode;
  };
  resetButton?: {
    label?: string;
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
    size?: "sm" | "md" | "lg";
    icon?: ReactNode;
  };
  validationMode?: "onChange" | "onBlur" | "onSubmit";
  reValidateMode?: "onChange" | "onBlur" | "onSubmit";
  className?: string;
  style?: Record<string, any>;
}

// Estados do formulário
export interface FormActions {
  submit: () => void;
  reset: () => void;
  setValue: (name: string, value: any) => void;
  setError: (name: string, error: FormValidationError) => void;
  clearErrors: () => void;
}

export interface FormValues {
  [key: string]: any;
}

// Props para componentes de formulário
export interface FormFieldProps {
  config: FieldConfig;
  value?: any;
  error?: string;
  onChange: (value: any) => void;
  onBlur?: () => void;
  className?: string;
}

export interface FormProps {
  config: FormConfig;
  initialValues?: FormValues;
  onSubmit: (values: FormValues) => void | Promise<void>;
  onChange?: (values: FormValues) => void;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

// Schemas Zod para validação
export interface ZodFormSchema {
  [key: string]: z.ZodTypeAny;
}

// Utilitários para formulários
export interface FormUtils {
  validateField: (config: FieldConfig, value: any) => FormValidationError[];
  validateForm: (
    config: FormConfig,
    values: FormValues
  ) => FormValidationError[];
  getDefaultValues: (config: FormConfig) => FormValues;
  getFieldValue: (values: FormValues, fieldName: string) => any;
  setFieldValue: (
    values: FormValues,
    fieldName: string,
    value: any
  ) => FormValues;
  formatFieldValue: (config: FieldConfig, value: any) => any;
  parseFieldValue: (config: FieldConfig, value: any) => any;
}

// Tipos para formulários dinâmicos
export interface DynamicFormConfig {
  schema: ZodFormSchema;
  fields: FieldConfig[];
  sections?: FieldGroup[];
  validation?: {
    mode?: "onChange" | "onBlur" | "onSubmit";
    reValidateMode?: "onChange" | "onBlur" | "onSubmit";
  };
}

// Tipos para formulários com steps
export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FieldConfig[];
  validation?: ZodFormSchema;
}

export interface MultiStepFormConfig {
  steps: FormStep[];
  allowBackNavigation?: boolean;
  showProgress?: boolean;
  submitButton?: {
    label?: string;
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
  };
}

// Estados para formulários multi-step
export interface MultiStepFormState {
  currentStep: number;
  completedSteps: Set<number>;
  values: FormValues;
  errors: Record<string, FormValidationError[]>;
  isSubmitting: boolean;
}

// Tipos para formulários de busca/filtros
export interface FilterFormConfig {
  fields: FieldConfig[];
  layout?: "inline" | "stacked";
  debounceMs?: number;
  onFiltersChange: (filters: FormValues) => void;
  onReset?: () => void;
}

// Tipos para formulários modais
export interface ModalFormConfig extends FormConfig {
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl";
  closable?: boolean;
  onClose?: () => void;
}

// Tipos para validação customizada
export interface CustomValidation {
  name: string;
  validator: (
    value: any,
    formValues?: FormValues
  ) => boolean | Promise<boolean>;
  message: string;
}

export interface FieldValidation extends CustomValidation {
  field: string;
  when?: (formValues: FormValues) => boolean;
}

// Tipos para transformação de dados
export interface FieldTransformer {
  input?: (value: any) => any;
  output?: (value: any) => any;
}

export interface FormTransformer {
  input?: (values: FormValues) => FormValues;
  output?: (values: FormValues) => FormValues;
}

// Tipos para acessibilidade
export interface AccessibleFormConfig extends FormConfig {
  ariaLabel?: string;
  ariaDescribedBy?: string;
  role?: string;
}

// Tipos para testes
export interface TestableFormConfig extends FormConfig {
  testId?: string;
  dataCy?: string;
}

// Exportação de tipos utilitários
export type FieldValue<T extends FieldConfig> = T["defaultValue"];
export type FormData<T extends FormConfig> = T["fields"] extends FieldConfig[]
  ? {
      [K in T["fields"][number] as T["fields"][number]["name"]]: FieldValue<
        T["fields"][number]
      >;
    }
  : FormValues;
