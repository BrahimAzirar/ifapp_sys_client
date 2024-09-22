import Types from './Types';

const DefaultState = { StudentData: {} };

const StudentReducer = (state = DefaultState, action) => {

    if (action.type === Types.EXPORTSTUDENTDATA) {
        return { ...state, StudentData: action.payload };
    }

    return state;
};

export default StudentReducer;