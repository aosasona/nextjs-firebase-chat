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

      // Set state
      return {
        ...state,
        ID: action.payload.ID,
        Username: action.payload.username,
        Token: action.payload.token,
      };
    case "LOGOUT":
      return { ...state, ID: null, Username: null, Token: null };
    case "REFRESH_TOKEN":
      return { ...state, Token: action.payload };
    case "REFRESH_USER":
      return {
        ...state,
        ID: action.payload.ID,
        Username: action.payload.username,
      };
    default:
      return state;
  }
}

export default reducer;
