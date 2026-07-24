'use client';
import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './index';
import { useAppSelector } from '@/src/hooks/useAppSelector';

function ThemeApplier({ children }: { children: React.ReactNode }) {
  const theme = useAppSelector((s) => s.ui.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return <>{children}</>;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeApplier>{children}</ThemeApplier>
    </Provider>
  );
}