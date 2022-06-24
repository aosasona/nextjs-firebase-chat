import { createContext, useEffect, useReducer } from "react";
import type { FC } from "react";
import reducer from "utils/reducer.util";
import request from "utils/request.util";
import Cookies from "js-cookie";

interface ContextInterface {
  ID: string | null;
  Username: string | null;
  Token: string | null;
  Users: any[];
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
    Loading: true,
    Users: [],
  };

  const [state, dispatch] = useReducer(reducer, data);

  // Get token and user data on first render
  useEffect(() => {
    // Get token from cookie
    const token = Cookies.get("accessToken");

    // If token exists, get user data
    if (token) {
      // Set token to state
      dispatch({ type: "REFRESH_TOKEN", payload: token });

      request
        .auth(token)
        .get("/users/me")
        .then(({ data }) => {
          dispatch({
            type: "REFRESH_USER",
            payload: {
              ID: data.data.id,
              username: data.data.username,
            },
          });
        })
        .catch(({ response }) => {
          console.log(response.data.message);
        });
    }
  }, []);

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
