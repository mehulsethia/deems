import { createMMKV } from 'react-native-mmkv';

/** Local-only app state. Never holds credentials, cookies or message content. */
export const storage = createMMKV({ id: 'onlydm' });
