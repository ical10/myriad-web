import React, { useEffect } from 'react';
import { CookiesProvider } from 'react-cookie';

import { Provider } from 'next-auth/client';
import { AppProps } from 'next/app';
import Head from 'next/head';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';

import { TransactionProvider } from '../src/components/tippingJar/transaction.context';
import { MyriadAccountProvider } from '../src/components/wallet/wallet.context';
import theme from '../src/themes/default';

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement && jssStyles.parentElement.removeChild(jssStyles);
    }

    // keyring.loadAll({ ss58Format: 42, type: 'sr25519' });
  }, []);

  const pageTitle = 'Myriad';
  const description =
    'A social platform that’s entirely under your control. Remain anonymous, look for your own topics, choose your interface and control what you see.';

  return (
    <React.Fragment>
      <Head>
        <link rel="shortcut icon" href="/images/favicon.svg" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <meta name="description" content={description}></meta>
        <meta property="og:title" content={pageTitle} key="ogtitle" />
        <meta property="og:description" content={description} key="ogdesc" />
        <title>{pageTitle}</title>
      </Head>
      <ThemeProvider theme={theme}>
        <TransactionProvider>
          <MyriadAccountProvider>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Provider
              // Provider options are not required but can be useful in situations where
              // you have a short session maxAge time. Shown here with default values.
              options={{
                // Client Max Age controls how often the useSession in the client should
                // contact the server to sync the session state. Value in seconds.
                // e.g.
                // * 0  - Disabled (always use cache value)
                // * 60 - Sync session state with server if it's older than 60 seconds
                clientMaxAge: 0,
                // Keep Alive tells windows / tabs that are signed in to keep sending
                // a keep alive request (which extends the current session expiry) to
                // prevent sessions in open windows from expiring. Value in seconds.
                //
                // Note: If a session has expired when keep alive is triggered, all open
                // windows / tabs will be updated to reflect the user is signed out.
                keepAlive: 0
              }}
              session={pageProps.session}>
              <CookiesProvider>
                <Component {...pageProps} />
              </CookiesProvider>
            </Provider>
          </MyriadAccountProvider>
        </TransactionProvider>
      </ThemeProvider>
    </React.Fragment>
  );
};

export default App;
