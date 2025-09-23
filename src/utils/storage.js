export const storage = {
  getItem: (name) => {
    try {
      const item = localStorage.getItem(name);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item ${name} from localStorage:`, error);
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item ${name} to localStorage:`, error);
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.error(`Error removing item ${name} from localStorage:`, error);
    }
  },
};
