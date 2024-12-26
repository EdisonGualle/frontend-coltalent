import { configureStore } from '@reduxjs/toolkit';
import employeReducer from './Employee/employeSlice';
import userReducer from './User/userSlice';
import rolReducer from './User/rolSlice';
import userStateReducer from './User/userStateSlice';
import departamentReducer from './Organization/DepartamentSlice';
import unitReducer from './Organization/UnitSlince';
import positionReducer from './Organization/PositionSlice';
import formalEducationReducer from './Employee/Education/formalEducationSince';
import educationLevelReducer from './Employee/Education/educationLevelSince';
import educationStateReducer from './Employee/Education/educationStateSince';
import languageReducer from './Employee/Backgrounds/languageSlince';
import publicationReducer from './Employee/Backgrounds/publicationSlince';
import publicationTypeReducer from './Employee/Backgrounds/publicationTypeSlince';
import trainingReducer from './Employee/Education/trainingSlince';
import trainingTypeReducer from './Employee/Education/trainingTypeSlince';
import workExperienceReducer from './Employee/Backgrounds/workExperienceSlince';
import workReferenceReducer from './Employee/Backgrounds/workReferenceSlince';
import rejectionReasonReducer from './Leave/rejectionReasonSlince';
import leaveTypeReducer from './Leave/leaveTypeSlince';
import leaveReducer from './Leave/leaveSince';
import assignedLeavesReducer from './Leave/assignedLeavesSlice';
import leaveCommentReducer from './Leave/leaveCommentSlince';
import leaveHistoryReducer from './Leave/leaveHistorySlince';
import delegationsReducer from './Delegations/delegationsSlice';
import configurationReducer from './Configuration/configurationSlice';
import schedulesReducer from './Schedules/ScheduleSlince';

export default configureStore({
  reducer: {
    employee: employeReducer,
    user: userReducer,
    role: rolReducer,
    userState: userStateReducer,
    departament: departamentReducer,
    unit: unitReducer,
    position: positionReducer,
    formalEducation: formalEducationReducer,
    educationLevel: educationLevelReducer,
    educationState: educationStateReducer,
    language: languageReducer,
    publication: publicationReducer,
    publicationType: publicationTypeReducer,
    training: trainingReducer,
    trainingType: trainingTypeReducer,
    workExperience: workExperienceReducer,
    workReference: workReferenceReducer,
    rejectionReason: rejectionReasonReducer,
    leaveType: leaveTypeReducer,
    leave: leaveReducer,
    assignedLeaves: assignedLeavesReducer,
    leaveComment: leaveCommentReducer,
    leaveHistory: leaveHistoryReducer,
    delegations: delegationsReducer,
    configuration: configurationReducer,
    schedules: schedulesReducer,
  },
});