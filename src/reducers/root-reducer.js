import { combineReducers } from 'redux';
import CandidatesReducer from './users-reducer'

const rootReducer = combineReducers({
    candidatesRed: CandidatesReducer
});
export default rootReducer;