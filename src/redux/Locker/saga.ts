import { call, put, takeLatest, delay, cps } from 'redux-saga/effects';
import { actions } from './slice';
import { DTO } from 'types/DTO';
import { getMoreReviews, getReviews, getResources } from 'services';

export function* getReviewSaga({ payload }) {
  delay(500);

  try {
    const response: DTO.Locker.GetReviewsResponse = yield call(
      getReviews,
      payload,
    );

    yield put(actions.getReviewsActionSuccess(response));
  } catch (error) {
    yield put(actions.getReviewsActionFailed());
  }
}

export function* getMoreReviewSaga({ payload }) {
  delay(500);
  try {
    const response: DTO.Locker.GetMoreReviewsResponse = yield call(
      getMoreReviews,
      payload,
    );
    yield put(actions.getMoreReviewsActionSuccess(response));
  } catch (error) {
    yield put(actions.getMoreReviewsActionFailed());
  }
}

export function* getResourcesSaga({ payload }) {
  delay(500);

  try {
    const response: DTO.Locker.Resource.getResourcesResponse = yield call(
      getResources,
      payload,
    );

    yield put(actions.getResourcesActionSuccess(response));
  } catch (error) {
    yield put(actions.getResourcesActionFailed());
  }
}

export function* LockerSaga() {
  yield takeLatest(actions.getReviewsAction, getReviewSaga);
  yield takeLatest(actions.getMoreReviewsAction, getMoreReviewSaga);

  yield takeLatest(actions.getResourcesAction, getResourcesSaga);
}
