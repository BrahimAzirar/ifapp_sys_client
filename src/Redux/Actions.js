import Types from "./Types";

const IsAuthenticated = () => {
    return { type: Types.ISAUTH };
};

const IsNotAuthenticated = () => {
    return { type: Types.ISNOTAUTH };
};

const exportAllSpecialities = (specialities) => {
    return { type: Types.EXPORTALLSPECIALITIES, payload: specialities };
};

const update_speciality = (id, newData) => {
    return { type: Types.UPDATE_SPECIALITY, payload: {
        SpecialityId: id, SpecialityData: newData
    } }
};

const delete_speciality = (id) => {
    return { type: Types.DELETE_SPECIALITY, payload: id };
};

const add_speciality = (data) => {
    return { type: Types.ADD_SPECIALITY, payload: data };
};

const exportAllGroups = (data) => {
    return { type: Types.EXPORTALLGROUPS, payload: data };
};

const delete_group = (id) => {
    return { type: Types.DELETE_GROUP, payload: id };
};

const update_group = (id, data) => {
    return { type: Types.UPDATE_GROUP, payload: {
        GroupId: id, NewData: data
    } };
};

const add_group = (data) => {
    return { type: Types.ADD_GROUP, payload: data };
};

const export_all_SchoolYears = (data) => {
    return { type: Types.EXPORTALLSCHOOLYEARS, payload: data };
};

const export_student_data = (data) => {
    return { type: Types.EXPORTSTUDENTDATA, payload: data };
};

const student_is_auth = () => {
    return { type: Types.STUDENTISAUTH };
};

const student_is_not_auth = () => {
    return { type: Types.STUDENTISNOTAUTH };
};

export default {
    IsAuthenticated, IsNotAuthenticated, exportAllSpecialities, update_speciality,
    delete_speciality, add_speciality, exportAllGroups, delete_group, update_group,
    add_group, export_all_SchoolYears, export_student_data, student_is_auth,
    student_is_not_auth
};