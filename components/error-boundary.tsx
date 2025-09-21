'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Chama callback personalizado se fornecido
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Se um fallback personalizado foi fornecido, use-o
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className='flex flex-col items-center justify-center min-h-[400px] p-8 bg-red-50 border border-red-200 rounded-lg'>
          <div className='flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4'>
            <AlertTriangle className='w-8 h-8 text-red-600' />
          </div>

          <h2 className='text-xl font-semibold text-red-800 mb-2'>Algo deu errado</h2>

          <p className='text-red-600 text-center mb-6 max-w-md'>
            Ocorreu um erro inesperado. Nossa equipe foi notificada e estamos trabalhando para
            resolver o problema.
          </p>

          {this.props.showDetails && this.state.error && (
            <details className='mb-6 p-4 bg-red-100 rounded border text-sm'>
              <summary className='cursor-pointer font-medium text-red-800'>
                Detalhes do erro
              </summary>
              <pre className='mt-2 text-red-700 whitespace-pre-wrap'>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}

          <div className='flex gap-3'>
            <Button
              onClick={this.handleRetry}
              variant='outline'
              className='flex items-center gap-2'
            >
              <RefreshCw className='w-4 h-4' />
              Tentar novamente
            </Button>

            <Button
              onClick={() => window.location.reload()}
              variant='default'
              className='flex items-center gap-2'
            >
              Recarregar página
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook para usar Error Boundary em componentes funcionais
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Componente para capturar erros assíncronos
export function AsyncErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className='flex flex-col items-center justify-center p-8'>
          <AlertTriangle className='w-12 h-12 text-yellow-500 mb-4' />
          <h3 className='text-lg font-medium mb-2'>Erro ao carregar dados</h3>
          <p className='text-gray-600 text-center'>
            Não foi possível carregar os dados. Verifique sua conexão e tente novamente.
          </p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
