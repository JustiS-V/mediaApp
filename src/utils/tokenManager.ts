import * as Keychain from 'react-native-keychain';

const TOKEN_KEY = 'firebase_id_token';

export async function saveToken(token: string) {
  await Keychain.setGenericPassword(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  const credentials = await Keychain.getGenericPassword();
  if (credentials && credentials.username === TOKEN_KEY) {
    return credentials.password;
  }
  return null;
}

export async function removeToken() {
  await Keychain.resetGenericPassword();
}
