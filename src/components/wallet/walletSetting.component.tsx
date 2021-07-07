import React, { useState, useImperativeHandle, useEffect } from 'react';

import { useSession } from 'next-auth/client';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import SendIcon from '@material-ui/icons/Send';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import DialogTitle from '../common/DialogTitle.component';
import SearchComponent from '../common/search.component';
import { TabPanel } from '../common/tab-panel.component';
import { StyledTabs, StyledTab } from '../common/tabs.component';

import { useStyles } from 'src/components/wallet/walletSetting.style';
import { useToken } from 'src/hooks/use-token.hook';
import { Token } from 'src/interfaces/token';

interface Props {
  forwardedRef: React.ForwardedRef<any>;
}

const WalletSettingComponent: React.FC<Props> = ({ forwardedRef }) => {
  const styles = useStyles();

  const [session, sessionLoading] = useSession();
  let userId = session?.user.userId as string;

  const { loadAllTokens, loading, errorTokens, isTokenAddSuccess, resetErrorUserTokens, errorUserTokens, addUserToken, tokens } = useToken(
    userId
  );

  useEffect(() => {
    if (session !== null && !sessionLoading) {
      userId = session?.user.userId as string;
    }
  }, [sessionLoading]);

  const [selectedAsset, setSelectedAsset] = useState<Token | null>(null);

  useEffect(() => {
    loadAllTokens();
    setSelectedAsset(null);
    resetErrorUserTokens();
  }, []);

  const [errorPopup, setErrorPopup] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);

  //delayReset must be bigger than delayClosePopup!
  const delayReset = 3250;
  const delayClosePopup = 3000;

  useEffect(() => {
    if (errorUserTokens) {
      setErrorPopup(true);
    }
    let timeoutID = setTimeout(() => {
      resetErrorUserTokens();
    }, delayReset);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [errorUserTokens]);

  useEffect(() => {
    if (isTokenAddSuccess) {
      setSuccessPopup(true);
      closeSetting();
    }
  }, [isTokenAddSuccess]);

  const [idx, setIdx] = React.useState(0);
  const [showSetting, setShowSetting] = useState(false);

  const [value, setValue] = useState('');
  const [RPCAddress, setRPCAddress] = useState('');

  useImperativeHandle(forwardedRef, () => ({
    triggerShowSetting: () => {
      setShowSetting(true);
    }
  }));

  const closeSetting = () => {
    setErrorPopup(false);
    setShowSetting(false);
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setIdx(newValue);
  };

  const submitSearch = (newValue: string) => {
    setValue(newValue);
  };

  const submitSearchRPCAdress = (newValue: string) => {
    setRPCAddress(newValue);
  };

  const handleCloseError = () => {
    setErrorPopup(false);
  };

  const handleCloseSuccess = () => {
    setSuccessPopup(false);
  };

  const handleSelectAsset = (token: Token) => {
    setSelectedAsset(token);
  };

  const addAsset = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (selectedAsset) {
      addUserToken(selectedAsset?.id, userId);
    }
  };

  const DOTLogoURL = 'https://s3.us-east-2.amazonaws.com/nomics-api/static/images/currencies/DOT.svg';
  const AUSDLogoURL = 'https://apps.acala.network/static/media/AUSD.439bc3f2.png';
  const ACALogoURL = 'https://dotmarketcap.com/uploads/Acala%20LOGO-04.png';
  const NOLogoURL = 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Icon-round-Question_mark.svg';
  const MYRLogoPath = 'https://pbs.twimg.com/profile_images/1407599051579617281/-jHXi6y5_400x400.jpg';

  const capitalizeFirstLetter = (str: string, locale = navigator.language) => {
    return str.replace(/^\p{CWU}/u, char => char.toLocaleUpperCase(locale));
  };

  const LoadingComponent = () => {
    return (
      <Grid container justify="center">
        <CircularProgress className={styles.loading} />
      </Grid>
    );
  };

  const ErrorComponent = () => {
    return (
      <Grid container justify="center">
        <Typography>Error, please try again later!</Typography>
      </Grid>
    );
  };

  const RenderPrimaryText = (token: Token) => {
    return <Typography>{token?.id}</Typography>;
  };

  const RenderSecondaryText = (token: Token) => {
    return <Typography variant="subtitle2">{capitalizeFirstLetter(token?.token_name)}</Typography>;
  };

  return (
    <>
      <Dialog
        maxWidth="sm"
        PaperProps={{
          style: { overflow: 'hidden' }
        }}
        fullWidth={true}
        open={showSetting}
        onClose={closeSetting}
        aria-labelledby="wallet-settings">
        <DialogTitle id="name" onClose={closeSetting}>
          {' '}
          Wallet Setting
        </DialogTitle>
        <StyledTabs value={idx} onChange={handleChange} aria-label="tabs-for-wallet-or-tipping">
          <StyledTab label="Search" />
          <StyledTab label="Custom Asset" />
        </StyledTabs>
        <TabPanel value={idx} index={0}>
          <DialogContent>
            <SearchComponent value={value} placeholder="Search by Asset ID, Name or Ticker Symbol" onSubmit={submitSearch} />
          </DialogContent>
          <DialogContent className={styles.walletSettingDialog}>
            <List>
              {loading ? (
                <LoadingComponent />
              ) : errorTokens ? (
                <ErrorComponent />
              ) : (
                tokens.map(token => (
                  <ListItem className={styles.listItemRoot} key={token?.id} button onClick={() => handleSelectAsset(token)}>
                    <Card className={styles.listItemToken}>
                      <CardHeader
                        avatar={
                          <Avatar
                            aria-label="avatar"
                            src={
                              token?.id === 'AUSD'
                                ? AUSDLogoURL
                                : token?.id === 'DOT'
                                ? DOTLogoURL
                                : token?.id === 'ACA'
                                ? ACALogoURL
                                : token?.id === 'MYR'
                                ? MYRLogoPath
                                : NOLogoURL
                            }
                          />
                        }
                        title={RenderPrimaryText(token)}
                        subheader={RenderSecondaryText(token)}
                      />
                    </Card>
                  </ListItem>
                ))
              )}
            </List>
          </DialogContent>
        </TabPanel>
        <TabPanel value={idx} index={1}>
          <DialogContent>
            <SearchComponent value={RPCAddress} placeholder="RPC Address (wss://rpc.myriad.systems)" onSubmit={submitSearchRPCAdress} />
          </DialogContent>
        </TabPanel>
        <DialogActions>
          <Button color="primary" fullWidth={true} size="large" variant="contained" startIcon={<SendIcon />} onClick={addAsset}>
            Add Asset
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={successPopup} autoHideDuration={delayClosePopup} onClose={handleCloseSuccess}>
        <Alert severity="success">
          <AlertTitle>Success!</AlertTitle>
          Token added to your wallet!
        </Alert>
      </Snackbar>

      <Snackbar open={errorPopup} autoHideDuration={delayClosePopup} onClose={handleCloseError}>
        <Alert severity="error">
          <AlertTitle>Error!</AlertTitle>
          {errorUserTokens === 422 ? 'Token is already on your wallet!' : errorUserTokens}
        </Alert>
      </Snackbar>
    </>
  );
};

export default WalletSettingComponent;
