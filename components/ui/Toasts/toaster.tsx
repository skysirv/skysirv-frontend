'use client';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from '@/components/ui/Toasts/toast';
import { useToast } from '@/components/ui/Toasts/use-toast';
import { useEffect } from 'react';

export function Toaster() {
  const { toast, toasts } = useToast();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);

    const status = url.searchParams.get('status');
    const statusDescription = url.searchParams.get('status_description');
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');

    if (error || status) {
      toast({
        title: error
          ? error ?? 'Hmm... Something went wrong.'
          : status ?? 'Alright!',
        description: error ? errorDescription : statusDescription,
        variant: error ? 'destructive' : undefined
      });

      url.searchParams.delete('error');
      url.searchParams.delete('status');
      url.searchParams.delete('status_description');
      url.searchParams.delete('error_description');

      const nextUrl =
        url.pathname + (url.searchParams.toString() ? `?${url.searchParams.toString()}` : '');

      window.history.replaceState({}, '', nextUrl);
    }
  }, [toast]);

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}