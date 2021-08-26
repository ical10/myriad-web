import {BalanceReducer} from './balance/reducer';
import {BaseReducer} from './base/reducer';
import {ConfigReducer} from './config/reducer';
import {ExperienceReducer} from './experience/reducer';
import {FriendRequestReducer} from './friend-request/reducer';
import {FriendReducer} from './friend/reducer';
import {NotificationReducer} from './notification/reducer';
import {ProfileReducer} from './profile/reducer';
import {TagReducer} from './tag/reducer';
import {TimelineReducer} from './timeline/reducer';
import {TipSummaryReducer} from './tip-summary/reducer';
import {TransactionReducer} from './transaction/reducer';
import {UserReducer} from './user/reducer';
import {WalletReducer} from './wallet/reducer';

import {combineReducers} from 'redux';

const reducers = {
  baseState: BaseReducer,
  configState: ConfigReducer,
  friendState: FriendReducer,
  friendRequestState: FriendRequestReducer,
  notificationState: NotificationReducer,
  tagState: TagReducer,
  profileState: ProfileReducer,
  timelineState: TimelineReducer,
  userState: UserReducer,
  tipSummaryState: TipSummaryReducer,
  balanceState: BalanceReducer,
  walletState: WalletReducer,
  transactionState: TransactionReducer,
  experienceState: ExperienceReducer,
};

export const combinedReducers = combineReducers(reducers);

export type RootState = ReturnType<typeof combinedReducers>;
