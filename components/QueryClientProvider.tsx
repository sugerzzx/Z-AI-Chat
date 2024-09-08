'use client';
import { FC, ReactNode } from 'react';
import { QueryClientProvider as TanstackQueryClientProvider, QueryClient } from '@tanstack/react-query';

interface QueryClientProviderProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

const QueryClientProvider: FC<QueryClientProviderProps> = ({ children }) => {
  return <TanstackQueryClientProvider client={queryClient}>{children}</TanstackQueryClientProvider>;
};

export default QueryClientProvider;