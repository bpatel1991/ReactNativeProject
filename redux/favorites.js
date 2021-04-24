import * as ActionTypes from './ActionTypes';

export const favorites = (state = [], action) => {
    switch (action.type) {
        case ActionTypes.ADD_FAVORITE:
            if (state.includes(action.payload)) {
                return state;
            }
            return state.concat(action.payload);

        case ActionTypes.DELETE_FAVORITE:
            return state.filter(favorite => favorite !== action.payload);   
            //this is updating our redux state: an array of numbers (favorite IDs), when we filter we get an entirely new array. We are creating a new state every time, so new array every time. This is what gets added to our redux store.//
        default:
            return state;
    }
};
