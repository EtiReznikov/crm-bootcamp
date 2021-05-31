/**
 * This is an example for state's slice called "Counter".
 * it has constants, actions, initial state and a reducer.
 */


/*
    Actions:
    1. create "decrement" action
    2. create a thunk to dispatch async action
    3. bonus: use `createAction` of redux toolkit
*/

//#region Action Constants
export const COUNTER_INCREMENT = 'COUNTER_INCREMENT'
//#endregion

//#region Action Creators
export const counterIncrement = (payload) => ({
    type: COUNTER_INCREMENT,
    payload,
})
//#endregion

/**
 * The Counter's initial state
 */
const initialState = {
    count: 0
}

/**
 * The Counter's reducer
 */
const counterReducer = (state = initialState, action = { type: '', payload: null }) => {
    switch (action.type) {
        case COUNTER_INCREMENT:
            /* 
                NOTE: You must return a new object!
                Do not mutate the state directly.
                State is immutable.

                WRONG: state.count++
                GOOD: return { ...state, count: state.count + 1 }

                Later:
                1. use `immer`
                2. bonus: use `createReducer` of redux toolkit
            */
            return { ...state, count: state.count + 1 }

        default:
            return state
    }
}

export default counterReducer;
