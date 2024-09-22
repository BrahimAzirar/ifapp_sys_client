import Types from "./Types"

const defaultState = {
    allSchoolYears: []
}

const Absences_Payments_Reducer = (state = defaultState, action) => {

    if (Types.EXPORTALLSCHOOLYEARS === action.type) {
        return { ...state, allSchoolYears: action.payload };
    }

    return state;

};


export default Absences_Payments_Reducer;