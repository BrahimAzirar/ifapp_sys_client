import Types from './Types';

const defaultState = {
    allGroups: []
};

const GroupsReducer = (state = defaultState, action) => {

    if (Types.EXPORTALLGROUPS === action.type) {
        return { ...state, allGroups: action.payload };
    }

    else if (Types.DELETE_GROUP === action.type) {
        const data = state.allGroups.filter(ele => ele.GroupId !== action.payload);
        return { ...state, allGroups: data };
    }

    else if (Types.UPDATE_GROUP === action.type) {
        const { GroupId, NewData } = action.payload;
        const data = state.allGroups.map(ele => {
            if (ele.GroupId === GroupId) {
                ele.GroupName = NewData.groupName;
                ele.Level = NewData.groupLevel;
            }
            return ele;
        });

        return { ...state, allGroups: data };
    }

    else if (Types.ADD_GROUP === action.type) {
        return { ...state, allGroups: [ ...state.allGroups, action.payload ] };
    }

    return state;

};

export default GroupsReducer;