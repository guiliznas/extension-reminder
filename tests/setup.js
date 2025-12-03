// Setup file para configurar mocks globais das APIs do Chrome

// Mock da API chrome.storage
global.chrome = {
  storage: {
    sync: {
      get: jest.fn((keys, callback) => {
        // Por padrão, retorna objetos vazios
        callback({});
      }),
      set: jest.fn((items, callback) => {
        if (callback) callback();
      })
    }
  },
  notifications: {
    create: jest.fn((notificationId, options, callback) => {
      if (callback) callback(notificationId);
    })
  },
  runtime: {
    sendMessage: jest.fn((message, callback) => {
      if (callback) callback();
    }),
    onMessage: {
      addListener: jest.fn()
    }
  }
};

// Mock de DOM APIs adicionais se necessário
global.MutationObserver = class {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  disconnect() {}
};

// Limpa os mocks antes de cada teste
beforeEach(() => {
  jest.clearAllMocks();
});
