import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { headerReducer } from "./header";
import { komoditasReducer } from "./komoditas";

const composeEnhancers = 
  (process.env.NODE_ENV !== 'production' && 
    typeof window !== 'undefined' && 
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const rootReducer = combineReducers({
  header: headerReducer,
  comodities: komoditasReducer,
});

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk)),
)