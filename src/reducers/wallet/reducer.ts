import {HYDRATE} from 'next-redux-wrapper';

import * as BaseConstants from '../base/constants';
import {State as BaseState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import update from 'immutability-helper';
import * as Redux from 'redux';
import {WalletDetail, ContentType} from 'src/interfaces/wallet';

export interface WalletState extends BaseState {
  recipientDetail: WalletDetail;
}

const initialState: WalletState = {
  loading: false,
  recipientDetail: {
    referenceId: '',
    walletAddress: '',
    contentType: ContentType.POST,
  },
};

export const WalletReducer: Redux.Reducer<WalletState, Actions> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case HYDRATE: {
      return action.payload.walletState;
    }

    case constants.FETCH_RECIPIENT_DETAIL: {
      return {
        ...state,
        payload: action.payload,
      };
    }

    case constants.SET_RECIPIENT_DETAIL: {
      return {
        ...state,
        recipientDetail: action.recipientDetail,
      };
    }

    case BaseConstants.ACTION_LOADING: {
      return update(state, {
        loading: {$set: action.loading},
      });
    }

    default: {
      return state;
    }
  }
};
