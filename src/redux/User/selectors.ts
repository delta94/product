import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.user || initialState;

export const userSelector = createSelector(
  [selectDomain],
  ({
    userProfile,
    userSearchResults,
    userSearchProfile,
    workExperiences,
    educations,
    loading,
    loadingUserSearchProfile,
  }) => ({
    userProfile,
    userSearchResults,
    userSearchProfile,
    workExperiences,
    educations,
    loading,
    loadingUserSearchProfile,
  }),
);
