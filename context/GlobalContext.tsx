import { createContext, useState, useReducer } from "react";
import type { FC } from "react";
import reducer from "utils/reducer.util";

interface ContextInterface {
  ID: string | null;
  Username: string | null;
  Token: string | null;
  [x: string | number | symbol]: unknown;
}

const GlobalContext = createContext<any>(null);
const { Provider } = GlobalContext;

const GlobalProvider: FC<ContextInterface | null | any> = ({ children }) => {
  // Initial state
  const data = {
    ID: null,
    Username: null,
    Token: null,
  };

  const [state, dispatch] = useReducer(reducer, data);

  return (
    <Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </Provider>
  );
};

export { GlobalContext, GlobalProvider };
