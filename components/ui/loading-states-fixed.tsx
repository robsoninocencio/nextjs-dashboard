import { cn } from '@/lib/utils';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useState, useCallback } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return <Loader2 className={cn('animate-spin text-blue-600', sizeClasses[size], className)} />;
}

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'spinner' | 'dots' | 'pulse';
}

export function LoadingState({
  message = 'Carregando...',
  size = 'md',
  className,
  variant = 'spinner',
}: LoadingStateProps) {
  if (variant === 'dots') {
    return (
      <div className={cn('flex flex-col items-center justify-center p-8', className)}>
        <div className='flex space-x-1 mb-4'>
          <div className='w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
          <div className='w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
          <div className='w-2 h-2 bg-blue-600 rounded-full animate-bounce'></div>
        </div>
        <p className='text-sm text-gray-600'>{message}</p>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex flex-col items-center justify-center p-8', className)}>
        <div className='w-16 h-16 bg-blue-600 rounded-full animate-pulse mb-4'></div>
        <p className='text-sm text-gray-600'>{message}</p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center p-8', className)}>
      <LoadingSpinner size={size} className='mb-4' />
      <p className='text-sm text-gray-600'>{message}</p>
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  message = 'Erro ao carregar dados',
  description = 'Não foi possível carregar os dados. Tente novamente.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8', className)}>
      <AlertCircle className='w-12 h-12 text-red-500 mb-4' />
      <h3 className='text-lg font-medium text-gray-900 mb-2'>{message}</h3>
      <p className='text-sm text-gray-600 text-center mb-6 max-w-md'>{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}

interface SuccessStateProps {
  message?: string;
  description?: string;
  onContinue?: () => void;
  className?: string;
}

export function SuccessState({
  message = 'Operação realizada com sucesso',
  description,
  onContinue,
  className,
}: SuccessStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8', className)}>
      <CheckCircle className='w-12 h-12 text-green-500 mb-4' />
      <h3 className='text-lg font-medium text-gray-900 mb-2'>{message}</h3>
      {description && (
        <p className='text-sm text-gray-600 text-center mb-6 max-w-md'>{description}</p>
      )}
      {onContinue && (
        <button
          onClick={onContinue}
          className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors'
        >
          Continuar
        </button>
      )}
    </div>
  );
}

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({
  isVisible,
  message = 'Carregando...',
  className,
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
        className
      )}
    >
      <div className='bg-white rounded-lg p-6 flex flex-col items-center'>
        <LoadingSpinner size='lg' className='mb-4' />
        <p className='text-sm text-gray-600'>{message}</p>
      </div>
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({ className, variant = 'text', width, height, lines = 1 }: SkeletonProps) {
  const baseClasses = 'bg-gray-200 animate-pulse rounded';

  if (variant === 'circular') {
    return (
      <div
        className={cn(baseClasses, 'rounded-full', className)}
        style={{ width: width || '2rem', height: height || '2rem' }}
      />
    );
  }

  if (variant === 'rectangular') {
    return (
      <div
        className={cn(baseClasses, className)}
        style={{ width: width || '100%', height: height || '2rem' }}
      />
    );
  }

  // Text variant
  return (
    <div className='space-y-2'>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(baseClasses, 'h-4', className)}
          style={{
            width: index === lines - 1 ? '75%' : width || '100%',
          }}
        />
      ))}
    </div>
  );
}

// Componente para loading de tabelas
export function TableLoadingState({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className='space-y-4'>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className='flex space-x-4'>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className='flex-1' height='2rem' />
          ))}
        </div>
      ))}
    </div>
  );
}

// Componente para loading de cards
export function CardLoadingState({ count = 3 }: { count?: number }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className='bg-white p-6 rounded-lg border'>
          <Skeleton className='mb-4' height='1.5rem' />
          <Skeleton className='mb-2' height='1rem' />
          <Skeleton className='mb-4' height='1rem' width='75%' />
          <Skeleton height='2rem' width='50%' />
        </div>
      ))}
    </div>
  );
}

// Hook para gerenciar estados de loading
export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);
  const [error, setError] = useState<string | null>(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const setErrorState = useCallback((errorMessage: string) => {
    setIsLoading(false);
    setError(errorMessage);
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setErrorState,
    reset,
  };
}
