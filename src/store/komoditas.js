import { steinStore } from "../api/api-method";

const initialState = {
  comodities: [],
  loading: false,
};

export function komoditasReducer(state = initialState, action) {
  switch (action.type) {
    case COMODITIES_FETCH:
      return {
        ...state,
        comodities: action.payload.comodities,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
}

// selectors
export const getComodities = (state) => state.comodities.comodities;
export const getLoading = (state) => state.comodities.loading;

// action creators
export const comoditiesFetch = (comodities) => ({
  type: COMODITIES_FETCH,
  payload: { comodities },
});

export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});

export function fetchComodities() {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch(setLoading(true));
      steinStore.read("list")
        .then(res => {
          const data = res;
          dispatch(comoditiesFetch(data));
          dispatch(setLoading(false));
          resolve(data);
        })
        .catch(err => {
          dispatch(setLoading(false));
          console.error("Error: ", err);
          reject(err);
        });
    });
  }
}

// action types
export const COMODITIES_FETCH = "comodities/comoditiesFetch";
export const SET_LOADING = "comodities/setLoading";