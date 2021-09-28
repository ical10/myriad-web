import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {getSession} from 'next-auth/client';

import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {RichTextComponent} from '../src/components-v2/Richtext/';
import {DefaultRichText} from '../src/components-v2/Richtext/RichText.stories';
import {Timeline as TimelineComponent} from '../src/components-v2/Timeline/';
import {Timeline} from '../src/components-v2/Timeline/Timeline.stories';
import {SearchBox as SearchBoxComponent} from '../src/components-v2/atoms/search/';
import {DefaultLayout} from '../src/components-v2/template/default/DefaultLayout';

//import {useResize} from 'src/hooks/use-resize.hook';
import {healthcheck} from 'src/lib/api/healthcheck';
import * as UserAPI from 'src/lib/api/user';
//import {RootState} from 'src/reducers';
import {fetchAvailableToken} from 'src/reducers/config/actions';
import {setAnonymous, setUser, fetchConnectedSocials} from 'src/reducers/user/actions';
//import {UserState} from 'src/reducers/user/reducer';
import {wrapper} from 'src/store';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    user: {
      width: 327,
      flex: '0 0 327px',
      marginRight: 0,
      'scrollbar-color': '#A942E9 #171717',
      'scrollbar-width': 'thin !important',
    },
    fullwidth: {
      width: 327,
    },
    content: {
      flex: 1,
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: '0 24px 0 24px',
      minHeight: '100vh',
      maxWidth: 726,
      [theme.breakpoints.up('xl')]: {
        maxWidth: 926,
      },
    },
  }),
);

const Home: React.FC = () => {
  //const style = useStyles();

  const dispatch = useDispatch();

  //const {anonymous} = useSelector<RootState, UserState>(state => state.userState);
  //const sourceRef = useRef<HTMLDivElement | null>(null);

  //const height = useResize(sourceRef);

  useEffect(() => {
    dispatch(fetchConnectedSocials());
    dispatch(fetchAvailableToken());
  }, [dispatch]);

  return (
    <DefaultLayout isOnProfilePage={false}>
      <SearchBoxComponent onSubmit={value => console.log(value)} />
      <RichTextComponent userProfilePict={DefaultRichText.args?.userProfilePict ?? ''} />
      <TimelineComponent
        posts={Timeline.args?.posts ?? []}
        anonymous={Timeline.args?.anonymous ?? false}
      />
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {dispatch} = store;
  const {res} = context;

  const available = await healthcheck();

  if (!available) {
    res.setHeader('location', '/maintenance');
    res.statusCode = 302;
    res.end();
  }

  const session = await getSession(context);

  if (!session) {
    res.setHeader('location', '/');
    res.statusCode = 302;
    res.end();
  }

  const anonymous = Boolean(session?.user.anonymous);
  const userId = session?.user.address as string;
  const username = session?.user.name as string;

  //TODO: this process should call thunk action creator instead of dispatch thunk acion
  //ISSUE: state not hydrated when using thunk action creator
  if (anonymous) {
    dispatch(setAnonymous(username));
  } else {
    const user = await UserAPI.getUserDetail(userId);

    dispatch(setUser(user));
  }

  return {
    props: {
      session,
    },
  };
});

export default Home;
