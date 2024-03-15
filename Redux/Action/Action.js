import * as actionType from '../Action/actionType';

export const setData = (data) => {
  return {
    type: actionType.SET_DATA,
    payload: data,
  };
};
export const setSelectedStudentId = (id) => {
  return {
    type: actionType.SET_SELECTED_STUDENT_ID,
    payload: id,
  };
};
