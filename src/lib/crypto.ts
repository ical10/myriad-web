import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Keyring, decodeAddress } from '@polkadot/keyring';
import type { KeyringPair } from '@polkadot/keyring/types';
import { u8aToHex } from '@polkadot/util';
import { mnemonicGenerate } from '@polkadot/util-crypto';
import { KeypairType } from '@polkadot/util-crypto/types';

export const toHexPublicKey = (account: InjectedAccountWithMeta) => {
  return u8aToHex(decodeAddress(account.address));
};

export const generateKey = (name: string): { mnemonic: string; key: string } => {
  const prefix = process.env.NEXT_PUBLIC_POLKADOT_KEYRING_PREFIX ? Number(process.env.NEXT_PUBLIC_POLKADOT_KEYRING_PREFIX) : 42;
  const cyptoType: KeypairType = process.env.NEXT_PUBLIC_POLKADOT_CRYPTO_TYPE
    ? (process.env.NEXT_PUBLIC_POLKADOT_CRYPTO_TYPE as KeypairType)
    : 'sr25519';
  const derivationPath = process.env.NEXT_PUBLIC_POLKADOT_DERIVATION_PATH;

  const keyring = new Keyring({ type: cyptoType, ss58Format: prefix });
  const seed = mnemonicGenerate();

  const pair: KeyringPair = keyring.createFromUri(seed + derivationPath, { name: name });
  const hexPublicKey = u8aToHex(pair.publicKey);

  return {
    mnemonic: seed,
    key: hexPublicKey
  };
};
