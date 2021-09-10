import React from 'react';

import Link from 'next/link';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Purple from '../../../images/Bank_note_Isometric_1.svg';
import Yellow from '../../../images/Conversation__Isometric_1.svg';
import LogoImage from '../../../images/myriad-logo-black.svg';
import {useStyles} from './login.style';

export const LoginComponent: React.FC = () => {
  const style = useStyles();

  return (
    <div className={style.root}>
      <Grid container spacing={0}>
        <Grid item xs={7}>
          <div className={`${style.paper} ${style.flex}`}>
            <LogoImage className={style.logo} />
            <Typography variant="h1" className={style.title}>
              Social Media with <span className={style.titlePrimary}>no boundaries</span>
            </Typography>
            <Button className={style.button} color="primary" variant="contained">
              Sign in
            </Button>
            <Typography className={style.span} component="span">
              Or try our{' '}
              <Link href={'/#'}>
                <a href={'/#'} className={style.link}>
                  demo
                </a>
              </Link>{' '}
              first{' '}
              <span role="img" aria-label="emoticon-peace">
                ✌️
              </span>
            </Typography>
            <Typography component="span">
              To access Myriad, you need to use{' '}
              <Link href={'https://polkadot.js.org/extension/'}>
                <a
                  href={'https://polkadot.js.org/extension/'}
                  className={style.link}
                  target="_blank"
                  rel="noreferrer">
                  Polkadot.js
                </a>
              </Link>
              , on your browser{' '}
              <span role="img" aria-label="emoticon-computer">
                💻
              </span>
            </Typography>
          </div>
        </Grid>
        <Grid item xs={5}>
          <div className={`${style.paper} ${style.background}`}>
            <Yellow style={{position: 'absolute', top: '50', left: '165'}} />
            <Purple style={{position: 'absolute', top: '200px', left: '-55px'}} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
