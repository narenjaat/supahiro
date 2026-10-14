import type { Character } from './api';

export type RootStackParamList = {
  List: undefined;
  Detail: { character: Character };
};
