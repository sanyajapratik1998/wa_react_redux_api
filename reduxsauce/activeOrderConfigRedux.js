const { createActions, createReducer } = require("reduxsauce")
const { REHYDRATE } = require('redux-persist')

const INITIAL_STATE = {
    selectedOrderType: null,
    pickUpDate: null,
    pickUpTime: null,
    selectedAddress: null,
    tableNumber: null,
};

/*................Types And Actions Creator.............*/

const { Types, Creators } = createActions({
    setSelectedOrderType: ['selectedOrderType'],
});

const activeOrderConfigTypes = Types;

/*....................Redusers...................*/

const setSelectedOrderType = (state,  obj ) =>{
    console.log("selected order type", obj);
    return({
    ...state,
    ...obj.selectedOrderType,
})};

const rehydrate = () => INITIAL_STATE;

/* ................ Hookup Reducers To Types ............... */

const reducer = createReducer(INITIAL_STATE, {
    [Types.SET_SELECTED_ORDER_TYPE]: setSelectedOrderType,
    [REHYDRATE]: rehydrate
});

module.exports = { ...Creators, activeOrderConfigTypes, reducer };