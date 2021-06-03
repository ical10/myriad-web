import React, { useState, useEffect } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles, withStyles } from '@material-ui/core/styles';

//import { useFriendsHook } from 'src/components/friends/use-friends-hook';
import { Transaction } from 'src/interfaces/transaction';
import { User } from 'src/interfaces/user';

type Props = {
  transactions: Transaction[];
  user: User;
  sortType?: string;
  sortDirection?: string;
};

type ListItemContentProps = {
  txHistory: Transaction;
  userId: string;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    expandButton: {
      justifyContent: 'center'
    }
  })
);

const useStylesListItemContent = makeStyles((theme: Theme) =>
  createStyles({
    badge: {
      textAlign: 'right',
      '& > *': {
        margin: '4px 2px',
        textAlign: 'right',
        height: theme.spacing(2),
        textTransform: 'uppercase'
      }
    },
    green: {
      color: '#4caf50'
    },
    red: {
      color: '#b9210d'
    }
  })
);

const StyledAvatar = withStyles({
  root: {
    width: 56,
    height: 56
  }
})(Avatar);

const StyledListItemAvatar = withStyles({
  root: {
    minWidth: 56,
    minHeight: 56,
    margin: '0 12px'
  }
})(ListItemAvatar);

const StyledListItemText = withStyles({
  primary: {
    color: '#4b4851',
    fontWeight: 'bold',
    fontSize: 16
  },
  secondary: {
    color: '#9e9e9e',
    fontWeight: 'normal',
    fontSize: 14
  }
})(ListItemText);

const ListItemContent = ({ txHistory, userId }: ListItemContentProps) => {
  const style = useStylesListItemContent();

  const defaultUserName = 'Unknown Myrian';

  const RenderPrimaryText = (txHistory: Transaction) => {
    return (
      <>
        {userId === txHistory?.from ? (
          <>You tipped {txHistory?.toUser?.name ?? defaultUserName} with Acala</>
        ) : (
          <>{txHistory?.fromUser?.name ?? defaultUserName} tipped you Acala</>
        )}
      </>
    );
  };

  const RenderSecondaryText = (txHistory: Transaction) => {
    const formatDate = () => {
      let formattedDate = new Date(txHistory?.createdAt);
      return formattedDate.toUTCString();
    };

    return <>{formatDate()}</>;
  };

  return (
    <div key={txHistory?.id}>
      <ListItem>
        <StyledListItemAvatar>
          <StyledAvatar
            aria-label="avatar"
            src={txHistory?.toUser?.id === userId ? txHistory?.fromUser?.profilePictureURL : txHistory?.toUser?.profilePictureURL}
          />
        </StyledListItemAvatar>
        <StyledListItemText primary={RenderPrimaryText(txHistory)} secondary={RenderSecondaryText(txHistory)} />
        <ListItemSecondaryAction>
          <div className={style.badge}>
            <Typography className={userId === txHistory?.from ? style.red : style.green}>
              {userId === txHistory?.from ? '-' : '+'} {txHistory?.value / 1000000000000}
            </Typography>
          </div>
        </ListItemSecondaryAction>
      </ListItem>
    </div>
  );
};

const TransactionListComponent: React.FC<Props> = ({ transactions, user }) => {
  const style = useStyles();
  const [expandable, setExpandable] = useState(true);

  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  //const { sendRequest } = useFriendsHook(user);

  const userId = user?.id as string;

  useEffect(() => {
    setAllTransactions(transactions);
  }, []);

  if (transactions.length === 0) return null;

  const handleClick = () => {
    setExpandable(!expandable);
  };

  const ExpandMore = () => {
    return (
      <ListItem className={style.expandButton}>
        <Button onClick={handleClick}>See more</Button>
      </ListItem>
    );
  };

  return (
    <>
      <List className={style.root}>
        {expandable
          ? allTransactions.slice(0, 2).map(txHistory => <ListItemContent txHistory={txHistory} userId={userId} />)
          : allTransactions.map(txHistory => <ListItemContent txHistory={txHistory} userId={userId} />)}
      </List>
      {expandable ? (
        <ExpandMore />
      ) : (
        <ListItem className={style.expandButton}>
          <Button onClick={handleClick}>See less</Button>
        </ListItem>
      )}
    </>
  );
};

export default TransactionListComponent;
