import Types from './Types';

const defaultState = {
    allSpecialities: []
}

const SpecialitiesReducer = (state = defaultState, action) => {

    if (Types.EXPORTALLSPECIALITIES === action.type) {
        return { ...state, allSpecialities: action.payload };
    }

    else if (Types.UPDATE_SPECIALITY === action.type) {
        const { SpecialityId, SpecialityData } = action.payload;
        const data = state.allSpecialities.map(ele => {
            if (ele.SpecialityId == SpecialityId) ele.SpecialityName = SpecialityData;
            return ele;
        });

        return { ...state, allSpecialities: data };
    }

    else if (Types.DELETE_SPECIALITY === action.type) {
        const data = state.allSpecialities.filter(ele => ele.SpecialityId !== action.payload);
        return { ...state, allSpecialities: data };
    }

    else if (Types.ADD_SPECIALITY === action.type) {
        return { ...state, allSpecialities: [...state.allSpecialities, action.payload] };
    }

    return state;

};

export default SpecialitiesReducer;