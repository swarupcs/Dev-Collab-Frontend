import { storage } from '../../utils/storage';

export const createPersistConfig = (name, partialize = null) => ({
  name,
  storage,
  partialize,
  onRehydrateStorage: () => (state) => {
    console.log('Hydration finished', state);
  },
});
