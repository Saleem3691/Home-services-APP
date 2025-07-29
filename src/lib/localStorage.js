export const getLocalStorage = (key, defaultValue = null) => {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  }
  return defaultValue;
};

export const setLocalStorage = (key, value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const simulateAPIRequest = (data, delay = 1000) => {
  return new Promise(resolve => {
    setTimeout(() => resolve({ 
      success: true, 
      data 
    }), delay);
  });
};