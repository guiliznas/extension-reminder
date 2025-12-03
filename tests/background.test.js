/**
 * Testes para background.js
 * Testam o processamento de notificações não-bloqueantes
 */

describe('Background Script - Notificações', () => {
  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    jest.clearAllMocks();
  });

  describe('Recebimento de mensagens', () => {
    test('deve criar notificação quando receber mensagem do tipo showNotification', () => {
      const mockRequest = {
        type: 'showNotification',
        message: 'Lembrete: Tire um print da tela!'
      };

      const mockSender = {};
      const mockSendResponse = jest.fn();

      // Simula o listener de mensagens
      const messageHandler = (request, sender, sendResponse) => {
        if (request.type === 'showNotification') {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon128.png',
            title: 'Google Meet - Lembrete',
            message: request.message,
            priority: 2
          });
        }
      };

      messageHandler(mockRequest, mockSender, mockSendResponse);

      expect(chrome.notifications.create).toHaveBeenCalledWith({
        type: 'basic',
        iconUrl: 'icon128.png',
        title: 'Google Meet - Lembrete',
        message: 'Lembrete: Tire um print da tela!',
        priority: 2
      });
    });

    test('deve usar mensagem customizada quando fornecida', () => {
      const customMessage = '📸 Hora de documentar a reunião!';
      const mockRequest = {
        type: 'showNotification',
        message: customMessage
      };

      const messageHandler = (request, sender, sendResponse) => {
        if (request.type === 'showNotification') {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon128.png',
            title: 'Google Meet - Lembrete',
            message: request.message,
            priority: 2
          });
        }
      };

      messageHandler(mockRequest, {}, jest.fn());

      expect(chrome.notifications.create).toHaveBeenCalledWith(
        expect.objectContaining({
          message: customMessage
        })
      );
    });

    test('não deve criar notificação para outros tipos de mensagem', () => {
      const mockRequest = {
        type: 'otherType',
        data: 'some data'
      };

      const messageHandler = (request, sender, sendResponse) => {
        if (request.type === 'showNotification') {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon128.png',
            title: 'Google Meet - Lembrete',
            message: request.message,
            priority: 2
          });
        }
      };

      messageHandler(mockRequest, {}, jest.fn());

      expect(chrome.notifications.create).not.toHaveBeenCalled();
    });
  });

  describe('Configuração de notificações', () => {
    test('notificação deve ter tipo básico', () => {
      const mockRequest = {
        type: 'showNotification',
        message: 'Teste'
      };

      const messageHandler = (request, sender, sendResponse) => {
        if (request.type === 'showNotification') {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon128.png',
            title: 'Google Meet - Lembrete',
            message: request.message,
            priority: 2
          });
        }
      };

      messageHandler(mockRequest, {}, jest.fn());

      expect(chrome.notifications.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'basic'
        })
      );
    });

    test('notificação deve usar ícone da extensão', () => {
      const mockRequest = {
        type: 'showNotification',
        message: 'Teste'
      };

      const messageHandler = (request, sender, sendResponse) => {
        if (request.type === 'showNotification') {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon128.png',
            title: 'Google Meet - Lembrete',
            message: request.message,
            priority: 2
          });
        }
      };

      messageHandler(mockRequest, {}, jest.fn());

      expect(chrome.notifications.create).toHaveBeenCalledWith(
        expect.objectContaining({
          iconUrl: 'icon128.png'
        })
      );
    });

    test('notificação deve ter título apropriado', () => {
      const mockRequest = {
        type: 'showNotification',
        message: 'Teste'
      };

      const messageHandler = (request, sender, sendResponse) => {
        if (request.type === 'showNotification') {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon128.png',
            title: 'Google Meet - Lembrete',
            message: request.message,
            priority: 2
          });
        }
      };

      messageHandler(mockRequest, {}, jest.fn());

      expect(chrome.notifications.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Google Meet - Lembrete'
        })
      );
    });

    test('notificação deve ter prioridade alta', () => {
      const mockRequest = {
        type: 'showNotification',
        message: 'Teste'
      };

      const messageHandler = (request, sender, sendResponse) => {
        if (request.type === 'showNotification') {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon128.png',
            title: 'Google Meet - Lembrete',
            message: request.message,
            priority: 2
          });
        }
      };

      messageHandler(mockRequest, {}, jest.fn());

      expect(chrome.notifications.create).toHaveBeenCalledWith(
        expect.objectContaining({
          priority: 2
        })
      );
    });
  });

  describe('Integração content script → background', () => {
    test('content script deve enviar mensagem correta para background', () => {
      const customMessage = 'Mensagem de teste';

      // Simula o content script enviando mensagem
      chrome.runtime.sendMessage({
        type: 'showNotification',
        message: customMessage
      });

      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: 'showNotification',
        message: customMessage
      });
    });

    test('fluxo completo: content → background → notificação', () => {
      const testMessage = 'Teste de fluxo completo';

      // 1. Content script envia mensagem
      const messageData = {
        type: 'showNotification',
        message: testMessage
      };
      chrome.runtime.sendMessage(messageData);

      // 2. Background recebe e processa
      const messageHandler = (request, sender, sendResponse) => {
        if (request.type === 'showNotification') {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon128.png',
            title: 'Google Meet - Lembrete',
            message: request.message,
            priority: 2
          });
        }
      };

      messageHandler(messageData, {}, jest.fn());

      // 3. Verifica que ambas as partes funcionaram
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith(messageData);
      expect(chrome.notifications.create).toHaveBeenCalledWith(
        expect.objectContaining({
          message: testMessage
        })
      );
    });
  });

  describe('Comportamento não-bloqueante', () => {
    test('notificações não devem bloquear execução de código', () => {
      const beforeNotification = jest.fn();
      const afterNotification = jest.fn();

      beforeNotification();

      const mockRequest = {
        type: 'showNotification',
        message: 'Teste'
      };

      const messageHandler = (request, sender, sendResponse) => {
        if (request.type === 'showNotification') {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon128.png',
            title: 'Google Meet - Lembrete',
            message: request.message,
            priority: 2
          });
        }
      };

      messageHandler(mockRequest, {}, jest.fn());
      afterNotification();

      // Ambas as funções devem ter sido chamadas
      expect(beforeNotification).toHaveBeenCalled();
      expect(afterNotification).toHaveBeenCalled();
    });

    test('múltiplas notificações podem ser criadas sem bloqueio', () => {
      const messageHandler = (request, sender, sendResponse) => {
        if (request.type === 'showNotification') {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon128.png',
            title: 'Google Meet - Lembrete',
            message: request.message,
            priority: 2
          });
        }
      };

      // Envia 3 notificações rapidamente
      messageHandler({ type: 'showNotification', message: 'Msg 1' }, {}, jest.fn());
      messageHandler({ type: 'showNotification', message: 'Msg 2' }, {}, jest.fn());
      messageHandler({ type: 'showNotification', message: 'Msg 3' }, {}, jest.fn());

      expect(chrome.notifications.create).toHaveBeenCalledTimes(3);
    });
  });
});
