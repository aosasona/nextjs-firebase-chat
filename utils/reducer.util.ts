import Cookies from "js-cookie";

interface ContextInterface {
  ID: string | null;
  Username: string | null;
  Token: string | null;
  [x: string | number | symbol]: unknown;
}

// Reducer
function reducer(state: ContextInterface, action: any): ContextInterface {
  switch (action.type) {
    case "LOGIN":
      // Set cookies
      Cookies.set("accessToken", action.payload.token, {
        expires: 7,
        path: "",
      });

      // Set state
      return {
        ...state,
        ID: action.payload.ID,
        Username: action.payload.username,
        Token: action.payload.token,
      };
    case "LOGOUT":
      // Remove cookies
      Cookies.remove("Token");

      // Set state
      return { ...state, ID: null, Username: null, Token: null };
    case "REFRESH_TOKEN":
      return { ...state, Token: action.payload, Loading: false };
    case "REFRESH_USER":
      return {
        ...state,
        ID: action.payload.ID,
        Username: action.payload.username,
        Loading: false,
      };
    case "SET_USERS":
      return { ...state, Users: action.payload };
    default:
      return state;
  }
}

export default reducer;
