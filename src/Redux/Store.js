import { legacy_createStore as CreateStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import AuthReducer from './AuthReducer';
import SpecialitiesReducer from './SpecialitiesReducer';
import GroupsReducer from './GroupsReducer';
import Absences_Payments_Reducer from './Absences_Payments_Reducer';
import StudentReducer from './StudentReducer';

const root = combineReducers({
    AuthReducer, SpecialitiesReducer, GroupsReducer, Absences_Payments_Reducer, StudentReducer
});
const store = CreateStore(root, composeWithDevTools(applyMiddleware(thunk)));

export default store;