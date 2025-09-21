import { z } from 'zod';
import type { ReactNode } from 'react';

// Tipos base aprimorados
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
}

// Tipos para tabelas genéricas
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, item: T) => ReactNode;
  format?: (value: any) => string;
}

export interface TableAction<T> {
  label: string;
  icon?: ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick: (item: T) => void;
  disabled?: (item: T) => boolean;
  hidden?: (item: T) => boolean;
}

export interface TableConfig<T> {
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  searchable?: boolean;
  sortable?: boolean;
  pagination?: boolean;
  loading?: boolean;
}

// Tipos para formulários genéricos
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'select' | 'textarea' | 'date' | 'currency';
  required?: boolean;
  placeholder?: string;
  description?: string;
  validation?: z.ZodSchema;
  options?: { label: string; value: string | number }[];
  disabled?: boolean;
  hidden?: boolean;
}

export interface FormSection {
  title?: string;
  description?: string;
  fields: FormField[];
  columns?: number;
}

export interface FormConfig {
  sections: FormSection[];
  submitLabel?: string;
  cancelLabel?: string;
  layout?: 'single' | 'two-column' | 'three-column';
}

// Tipos para filtros genéricos
export interface FilterOption {
  label: string;
  value: string | number;
  count?: number;
}

export interface FilterField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'date' | 'daterange' | 'number';
  placeholder?: string;
  options?: FilterOption[];
  multiple?: boolean;
  searchable?: boolean;
}

export interface FilterConfig {
  fields: FilterField[];
  layout?: 'inline' | 'stacked';
  debounceMs?: number;
}

// Tipos para validação
export interface ValidationResult {
  success: boolean;
  data?: any;
  errors?: Record<string, string[]>;
}

export interface FormState {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
}

// Tipos para loading states
export interface LoadingState {
  isLoading: boolean;
  error?: string;
  data?: any;
}

export interface SkeletonConfig {
  rows?: number;
  columns?: number;
  showAvatar?: boolean;
  showActions?: boolean;
}

// Tipos para navegação
export interface NavItem {
  title: string;
  href: string;
  icon?: ReactNode;
  badge?: string | number;
  children?: NavItem[];
  disabled?: boolean;
  external?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

// Tipos para dashboard
export interface DashboardCard {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: ReactNode;
  href?: string;
  description?: string;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
  date?: string;
}

// Tipos para modais e diálogos
export interface ModalConfig {
  title: string;
  description?: string;
  content: ReactNode;
  actions?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closable?: boolean;
}

// Tipos para notificações
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Tipos para permissões e autenticação
export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  permissions: Permission[];
}

// Tipos para configurações da aplicação
export interface AppConfig {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  currency: string;
  dateFormat: string;
}

// Tipos para cache e performance
export interface CacheConfig {
  ttl: number;
  maxSize?: number;
  strategy: 'memory' | 'localStorage' | 'sessionStorage';
}

export interface QueryConfig {
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
}

// Utilitários de tipo
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type NonNullable<T> = T extends null | undefined ? never : T;

// Tipos para eventos e callbacks
export interface EventHandler<T = any> {
  (event: T): void;
}

export interface AsyncEventHandler<T = any> {
  (event: T): Promise<void>;
}

// Tipos para componentes com ref
export interface ComponentWithRef<T = any> {
  ref?: React.Ref<T>;
}

// Tipos para componentes com children
export interface ComponentWithChildren {
  children?: ReactNode;
}

// Tipos para componentes com className
export interface ComponentWithClassName {
  className?: string;
}

// Combinação de tipos comuns
export type ComponentProps = ComponentWithChildren & ComponentWithClassName & ComponentWithRef;

export type FormComponentProps = ComponentProps & {
  name: string;
  value?: any;
  onChange?: (value: any) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
};

// Tipos para contextos
export interface ContextProviderProps {
  children: ReactNode;
}

export interface ContextValue<T> {
  data: T;
  loading: boolean;
  error?: string;
  refetch?: () => void;
}

// Tipos para hooks customizados
export interface UseAsyncReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: () => Promise<void>;
}

export interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  canGoNext: boolean;
  canGoPrev: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

export interface UseFiltersReturn<T> {
  filters: T;
  updateFilter: (key: keyof T, value: any) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

// Tipos para testes
export interface TestProps {
  'data-testid'?: string;
  'data-cy'?: string;
}

export interface MockData<T> {
  data: T;
  loading?: boolean;
  error?: string;
}
