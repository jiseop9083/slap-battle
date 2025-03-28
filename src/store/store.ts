import { create, StateCreator } from 'zustand';
import { devtools, persist, PersistOptions } from 'zustand/middleware';

type CustomMis = [['zustand/devtools', never]];
type CustomMisWithPersist = [
  ['zustand/devtools', never],
  ['zustand/persist', unknown],
];

export const createStore = <T extends object>(
  initializer: StateCreator<T, CustomMis>,
) => create<T, CustomMis>(devtools(initializer));

export const createStoreWithPersist = <T extends object, U extends object = T>(
  initializer: StateCreator<T, CustomMisWithPersist>,
  persistOptions: PersistOptions<T, U>,
) =>
  create<T, CustomMisWithPersist>(
    devtools(persist(initializer, persistOptions)),
  );
