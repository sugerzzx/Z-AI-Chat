'use client';
import { createContext, Dispatch, FC, ReactNode, useContext, useMemo, useReducer } from 'react';
import { State, Action, appReducer, initialState } from '@/lib/appReducer';

type AppContextProps = {
  state: State,
  dispatch: Dispatch<Action>;
};

interface AppContextProviderProps {
  children: ReactNode;
}

const AppContext = createContext<AppContextProps>(null!);

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider: FC<AppContextProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return <AppContext.Provider value={contextValue}>
    {children}
  </AppContext.Provider>;
};

export default AppContext;