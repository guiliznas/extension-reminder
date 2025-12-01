# Google Meet Screenshot Reminder Extension

Extensão do Chrome que lembra você de tirar prints durante chamadas do Google Meet.

## Funcionalidades

✅ **Detecção Automática**: Detecta automaticamente quando você entra em uma chamada do Google Meet
⏱️ **Timer de 3 Minutos**: Inicia um timer de 3 minutos quando a chamada é detectada
🔴 **Barra Vermelha**: Exibe uma barra vermelha no topo da tela com a mensagem de lembrete
✓ **Botão de Dismiss**: Permite remover a barra após tirar o print
🔄 **Múltiplas Reuniões**: Funciona para várias reuniões consecutivas

## Como Instalar

1. Abra o Chrome e vá em `chrome://extensions/`
2. Ative o **Modo do desenvolvedor** no canto superior direito
3. Clique em **Carregar sem compactação**
4. Selecione a pasta desta extensão (`extension-reminder`)
5. A extensão estará instalada e pronta para usar!

## Como Usar

1. Entre em uma chamada do Google Meet (https://meet.google.com/xxx-xxxx-xxx)
2. A extensão detectará automaticamente que você está em uma chamada
3. Após **3 minutos**, você verá:
   - Uma barra vermelha no topo da página com o lembrete
   - A mensagem: "🔴 Lembrete: Tire um print da tela!"
4. Tire o print da tela
5. Clique no botão **"✓ Print tirado"** para remover a barra

## Testando Mais Rápido

Se você quiser testar a extensão sem esperar 3 minutos:

1. Abra o arquivo `content.js`
2. Encontre a linha 61:
   ```javascript
   }, 180000); // 3 minutos em milissegundos
   ```
3. Descomente a linha 64 (remova o `//`):
   ```javascript
   reminderTimer = setTimeout(() => { showNotification(); }, 10000);
   ```
4. Salve o arquivo e recarregue a extensão em `chrome://extensions/`
5. Agora o lembrete aparecerá após **10 segundos** em vez de 3 minutos

## Estrutura dos Arquivos

```
extension-reminder/
├── manifest.json      # Configuração da extensão
├── content.js         # Lógica principal (detecção + timer)
├── styles.css         # Estilos da barra vermelha
├── icon48.png         # Ícone 48x48
├── icon128.png        # Ícone 128x128
└── README.md          # Este arquivo
```

## Observações

- O timer é **reiniciado** se você recarregar a página
- A extensão funciona apenas em páginas do Google Meet
- Você pode ter várias abas do Meet abertas - cada uma terá seu próprio timer
- Os logs da extensão podem ser vistos no Console do navegador (F12)

## Debug

Para ver os logs da extensão:
1. Abra o Console do DevTools (F12)
2. Procure por mensagens começando com `[Screenshot Reminder]`
3. Você verá quando o timer inicia e quando o lembrete é exibido

## Testes Automatizados

Este projeto inclui uma suite de testes automatizados usando Jest.

### Instalando Dependências

Antes de executar os testes, instale as dependências:

```bash
npm install
```

### Executando os Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (re-executa quando arquivos mudam)
npm run test:watch

# Executar testes com relatório de cobertura
npm run test:coverage
```

### Estrutura de Testes

```
tests/
├── setup.js          # Mocks das APIs do Chrome
├── popup.test.js     # Testes do popup de configurações
└── content.test.js   # Testes do content script
```

### O que é Testado

**popup.test.js**:
- ✅ Carregamento de mensagem salva
- ✅ Salvamento de mensagem customizada
- ✅ Restauração de mensagem padrão
- ✅ Validação de entrada
- ✅ Contador de caracteres

**content.test.js**:
- ✅ Carregamento de mensagem customizada
- ✅ Criação e remoção do banner
- ✅ Detecção de URLs do Google Meet
- ✅ Lógica do timer de 3 minutos
- ✅ Integração de mensagem no banner

---

**Desenvolvido para ajudar você a nunca esquecer de tirar prints das suas reuniões! 📸**

