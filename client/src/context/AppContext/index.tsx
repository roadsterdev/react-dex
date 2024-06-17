import React, { ReactNode, createContext, useContext } from 'react'
import { AppAction, AppState } from './types';
import { useAppReducer } from './reducer';

type AppContextType = {
  appState: AppState
  appDispatch: React.Dispatch<AppAction>
}

export const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [appState, appDispatch] = useAppReducer()

  return (
    <AppContext.Provider value={{ appState, appDispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    throw new Error('error')
  }

  return appContext
}