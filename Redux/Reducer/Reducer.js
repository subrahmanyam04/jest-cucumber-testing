import * as actionType from "../Action/actionType"
const Reducer = (state = { data: [], selectedStudentId: null, }, action) => {
  switch (action.type) {
    case actionType.SET_DATA:
      return {
        ...state,
        data: action.payload,
      };
    case actionType.SET_SELECTED_STUDENT_ID:
      return {
        ...state,
        selectedStudentId: action.payload,
      };
    default:
      return state;
  }
};
export default Reducer;
