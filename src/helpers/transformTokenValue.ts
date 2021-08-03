import {Transaction} from 'src/interfaces/transaction';

//TODO: we might need to remove this file, MYRIA will be converted w/o decimals on the latest API

enum TokenID {
  MYRIA = 'MYRIA',
  AUSD = 'AUSD',
  DOT = 'DOT',
  ACA = 'ACA',
}

const basicTransform = (txHistory: Transaction) => {
  let temp = '';
  temp = txHistory.value.toString();
  return temp;
};

const transformValueForMYRIA = (txHistory: Transaction) => {
  let temp = '';
  const BASE_NUMBER = 10;
  if (!txHistory.token) {
    temp = 'Decimals N/A';
    return temp;
  }

  temp = (txHistory.value / BASE_NUMBER ** txHistory.token.token_decimal).toString();
  return temp;
};

export const transformTokenValue = (txHistory: Transaction) => {
  let tokenValue = '';
  switch (txHistory.tokenId) {
    case TokenID.AUSD:
      tokenValue = basicTransform(txHistory);
      break;
    case TokenID.ACA:
      tokenValue = basicTransform(txHistory);
      break;
    case TokenID.DOT:
      tokenValue = basicTransform(txHistory);
      break;
    default:
      tokenValue = transformValueForMYRIA(txHistory);
  }

  return tokenValue;
};
