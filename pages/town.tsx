import React from 'react';

import {Session} from 'next-auth';
import {getSession} from 'next-auth/react';
import getConfig from 'next/config';
import Head from 'next/head';

import TownContainer from 'src/components/Town/Town.container';
import {TopNavbarComponent, SectionTitle} from 'src/components/atoms/TopNavbar';
import {DefaultLayout} from 'src/components/template/Default/DefaultLayout';
import {initialize} from 'src/lib/api/base';
import {getServer} from 'src/lib/api/server';
import i18n from 'src/locale';
import {fetchAvailableToken} from 'src/reducers/config/actions';
import {countNewNotification} from 'src/reducers/notification/actions';
import {
  setAnonymous,
  fetchConnectedSocials,
  fetchUser,
  fetchUserExperience,
  fetchUserWallets,
  fetchNetwork,
} from 'src/reducers/user/actions';
import {wrapper} from 'src/store';
import {ThunkDispatchAction} from 'src/types/thunk';

const {publicRuntimeConfig} = getConfig();

type TownPageProps = {
  session: Session;
  logo: string;
};

const TownComponent: React.FC<TownPageProps> = props => {
  return (
    <DefaultLayout isOnProfilePage={false} {...props}>
      <Head>
        <title>{i18n.t('Myriad_Town.Title_Head', {appname: publicRuntimeConfig.appName})}</title>
      </Head>
      <TopNavbarComponent
        description={i18n.t('TopNavbar.Subtitle.Myriad_Town')}
        sectionTitle={SectionTitle.MYRIAD_TOWN}
        type={'menu'}
      />
      <TownContainer />
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {req} = context;

  const dispatch = store.dispatch as ThunkDispatchAction;
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const anonymous = Boolean(session?.user.anonymous);
  const userId = session?.user.address as string;

  initialize({cookie: req.headers.cookie}, anonymous);

  if (anonymous || !userId) {
    const username = session?.user.name as string;

    await dispatch(setAnonymous(username));
  } else {
    await dispatch(fetchUser());

    await Promise.all([
      dispatch(fetchConnectedSocials()),
      dispatch(fetchAvailableToken()),
      dispatch(countNewNotification()),
      dispatch(fetchUserWallets()),
    ]);
  }

  await dispatch(fetchNetwork());
  await dispatch(fetchUserExperience());

  const data = await getServer();

  return {
    props: {
      session,
      logo: data.images.logo_banner,
    },
  };
});

export default TownComponent;
