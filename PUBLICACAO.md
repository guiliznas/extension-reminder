# Guia de Publicação - Chrome Web Store

Este guia fornece um passo a passo completo para publicar a extensão **Google Meet Screenshot Reminder** na Chrome Web Store.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:

- [ ] Conta do Google
- [ ] Cartão de crédito válido (taxa única de **$5 USD** para registro como desenvolvedor)
- [ ] Todos os arquivos da extensão prontos e testados
- [ ] Imagens promocionais e ícones preparados

---

## 📁 Passo 1: Preparar os Arquivos da Extensão

### 1.1 Verificar Estrutura de Arquivos

Certifique-se de que sua extensão contém todos os arquivos necessários:

```
extension-print/
├── manifest.json       # Configuração principal
├── content.js         # Script de conteúdo
├── popup.html         # Interface do popup
├── popup.js           # Lógica do popup
├── popup.css          # Estilos do popup
├── styles.css         # Estilos do banner
├── icon48.png         # Ícone 48x48
└── icon128.png        # Ícone 128x128
```

### 1.2 Revisar o manifest.json

Verifique se todas as informações estão corretas:

- **name**: Nome da extensão
- **version**: Versão atual (exemplo: `1.0.0`)
- **description**: Descrição breve e clara
- **permissions**: Apenas as necessárias
- **icons**: Caminhos corretos para os ícones

### 1.3 Criar Ícones Adicionais

A Chrome Web Store requer ícones em diferentes tamanhos. Você já tem:
- ✅ 48x48 pixels
- ✅ 128x128 pixels

**Recomendado adicionar**:
- 16x16 pixels (para favicon)
- 32x32 pixels (opcional)

### 1.4 Criar um Arquivo ZIP

**Importante**: Comprima APENAS o conteúdo da pasta, não a pasta inteira.

**No terminal**:
```bash
cd /caminho/para/extension-print
zip -r ../extension-print.zip .
```

**Ou manualmente**:
1. Entre na pasta `extension-print`
2. Selecione todos os arquivos (não a pasta)
3. Clique com botão direito → "Comprimir"
4. Salve como `extension-print.zip`

---

## 💳 Passo 2: Criar Conta de Desenvolvedor

### 2.1 Acessar o Chrome Web Store Developer Dashboard

1. Acesse: https://chrome.google.com/webstore/devconsole
2. Faça login com sua conta do Google
3. Se for sua primeira vez, você verá a tela de registro

### 2.2 Pagar a Taxa de Registro

1. Clique em **"Pay registration fee"** ou **"Pagar taxa de registro"**
2. Taxa: **$5 USD** (pagamento único, vitalício)
3. Insira os dados do cartão de crédito
4. Complete o pagamento

> **Nota**: Esta taxa é cobrada apenas uma vez. Você poderá publicar quantas extensões quiser no futuro.

### 2.3 Aceitar os Termos

1. Leia os **Developer Agreement** (Termos de Desenvolvedor)
2. Marque a caixa de concordância
3. Clique em **"Accept"** ou **"Aceitar"**

---

## 📤 Passo 3: Publicar a Extensão

### 3.1 Iniciar Nova Publicação

1. No Developer Dashboard, clique em **"New Item"** ou **"Novo Item"**
2. Clique em **"Choose file"** ou **"Escolher arquivo"**
3. Selecione o arquivo `extension-print.zip` que você criou
4. Clique em **"Upload"**

### 3.2 Aguardar Upload e Verificação

O sistema irá:
- Fazer upload do arquivo
- Verificar a estrutura do manifest.json
- Validar permissões e arquivos

Se houver erros, corrija-os e faça upload novamente.

---

## 📝 Passo 4: Preencher Informações da Listagem

### 4.1 Informações Básicas

#### **Product Details** (Detalhes do Produto)

| Campo | Sugestão de Preenchimento |
|-------|---------------------------|
| **Name** | Google Meet Screenshot Reminder |
| **Summary** | Lembra você de tirar screenshots durante suas reuniões no Google Meet |
| **Description** | Veja exemplo detalhado abaixo ↓ |
| **Category** | Productivity (Produtividade) |
| **Language** | Portuguese (Brazil) ou English |

#### **Descrição Detalhada** (exemplo):

```
📸 Google Meet Screenshot Reminder

Nunca mais esqueça de documentar suas reuniões importantes!

Esta extensão detecta automaticamente quando você entra em uma chamada do Google Meet e, após 3 minutos, exibe um lembrete visual discreto para tirar um screenshot.

✨ RECURSOS:

• ⏰ Timer automático de 3 minutos
• 🔴 Banner vermelho discreto no topo da tela
• ✓ Botão de confirmação para dispensar o lembrete
• 🎨 Mensagem personalizável através do popup
• 🌙 Suporte para modo escuro

🎯 IDEAL PARA:

• Reuniões de trabalho
• Apresentações online
• Aulas remotas
• Entrevistas virtuais

🔒 PRIVACIDADE:

• Funciona apenas no Google Meet
• Não coleta dados pessoais
• Sem rastreamento
• Código open-source disponível

💡 COMO USAR:

1. Instale a extensão
2. Entre em uma reunião do Google Meet
3. A extensão detecta automaticamente
4. Após 3 minutos, você recebe o lembrete
5. Tire o screenshot e clique em "Print tirado"

🛠️ PERSONALIZAÇÃO:

Clique no ícone da extensão para personalizar a mensagem de lembrete de acordo com suas preferências!
```

### 4.2 Imagens e Mídia

A Chrome Web Store requer imagens promocionais:

#### **Store Icon** (Ícone da Loja)
- **Tamanho**: 128x128 pixels
- **Arquivo**: Use seu `icon128.png`

#### **Screenshots** (Capturas de Tela)
- **Tamanho**: 1280x800 ou 640x400 pixels
- **Quantidade**: Mínimo 1, recomendado 3-5
- **Sugestões**:
  1. Extensão em ação durante uma chamada do Meet
  2. Banner de lembrete sendo exibido
  3. Interface do popup de configurações
  4. Antes e depois de usar a extensão

> **Dica**: Use ferramentas como Figma, Canva ou Photoshop para criar screenshots profissionais

#### **Promotional Images** (Imagens Promocionais - Opcional)

| Tipo | Tamanho | Obrigatório |
|------|---------|-------------|
| Small Tile | 440x280 | Não |
| Marquee | 1400x560 | Não (mas recomendado) |

### 4.3 Informações Adicionais

#### **Official URL** (URL Oficial)
- GitHub do projeto (se disponível)
- Site oficial (se houver)
- Ou deixe em branco

#### **Homepage URL**
- Link para documentação
- Repositório GitHub
- Ou deixe em branco

#### **Support URL** (URL de Suporte)
- Email: seu-email@exemplo.com
- GitHub Issues: https://github.com/usuario/projeto/issues
- Ou deixe em branco

---

## 🔒 Passo 5: Configurar Privacidade

### 5.1 Privacy Practices (Práticas de Privacidade)

1. **Single Purpose** (Propósito Único):
   ```
   Esta extensão tem o único propósito de lembrar usuários a tirar screenshots
   durante reuniões do Google Meet após 3 minutos de chamada.
   ```

2. **Permission Justification** (Justificativa de Permissões):

   **notifications**:
   ```
   Necessário para exibir lembretes visuais ao usuário quando o timer de 3 minutos
   for atingido durante uma chamada do Google Meet.
   ```

   **storage**:
   ```
   Necessário para salvar as preferências do usuário, como a mensagem de lembrete
   personalizada, garantindo que as configurações sejam mantidas entre as sessões.
   ```

   **host_permissions: meet.google.com**:
   ```
   Necessário para detectar quando o usuário está em uma chamada do Google Meet
   e injetar o script de conteúdo que gerencia o timer e exibe o lembrete.
   ```

3. **Data Usage**:
   - ☑️ **This item does not collect user data** (Este item não coleta dados do usuário)

4. **Certification**:
   - Marque a caixa confirmando que você seguiu as políticas de privacidade

---

## 🌍 Passo 6: Distribuição

### 6.1 Visibility Options (Opções de Visibilidade)

Escolha uma opção:

- **Public** (Público): Qualquer pessoa pode encontrar e instalar
- **Unlisted** (Não listado): Apenas quem tiver o link pode instalar
- **Private** (Privado): Apenas usuários/grupos específicos

👉 **Recomendado**: Public (para máximo alcance)

### 6.2 Regions (Regiões)

- Selecione **All regions** (Todas as regiões) ou escolha países específicos
- Para máximo alcance, deixe "All regions"

### 6.3 Pricing (Preço)

- Esta extensão é gratuita
- Selecione: **Free** (Gratuito)

---

## ✅ Passo 7: Revisar e Enviar

### 7.1 Checklist Final

Antes de enviar, verifique:

- [ ] Todas as informações preenchidas corretamente
- [ ] Descrição clara e sem erros
- [ ] Pelo menos 1 screenshot enviado
- [ ] Ícones em todos os tamanhos necessários
- [ ] Permissões justificadas
- [ ] Categoria correta selecionada
- [ ] Política de privacidade configurada

### 7.2 Submeter para Revisão

1. Role até o final da página
2. Clique em **"Submit for Review"** ou **"Enviar para Revisão"**
3. Confirme o envio

---

## ⏳ Passo 8: Aguardar Revisão

### 8.1 Processo de Revisão

- **Tempo médio**: 1-3 dias úteis (pode variar)
- **Tempo máximo**: Até 7 dias
- Você receberá um email quando a revisão for concluída

### 8.2 Status da Revisão

Acompanhe no Developer Dashboard:
- **Pending review** (Aguardando revisão): Em fila
- **In review** (Em revisão): Sendo analisada
- **Published** (Publicada): Aprovada! 🎉
- **Rejected** (Rejeitada): Necessita correções

### 8.3 Se For Rejeitada

Não se preocupe! É comum na primeira tentativa.

1. Leia o email com os motivos da rejeição
2. Corrija os problemas apontados
3. Faça upload de uma nova versão
4. Submeta novamente

**Motivos comuns de rejeição**:
- Descrição muito vaga ou enganosa
- Permissões não justificadas adequadamente
- Violação das políticas da Chrome Web Store
- Funcionalidade não corresponde à descrição

---

## 🎉 Passo 9: Após a Publicação

### 9.1 Compartilhar sua Extensão

Após aprovação, você receberá um link como:
```
https://chrome.google.com/webstore/detail/[ID-DA-EXTENSAO]
```

Compartilhe nas redes sociais, com amigos, ou em seu site!

### 9.2 Monitorar Estatísticas

No Developer Dashboard você pode ver:
- Número de instalações
- Avaliações de usuários
- Comentários e feedback
- Dados de uso

### 9.3 Responder Avaliações

- Leia as avaliações dos usuários
- Responda perguntas e feedback
- Agradeça avaliações positivas
- Resolva problemas reportados

---

## 🔄 Passo 10: Atualizar a Extensão

### 10.1 Quando Atualizar

Atualize sua extensão quando:
- Corrigir bugs
- Adicionar novos recursos
- Melhorar desempenho
- Atualizar para novas APIs

### 10.2 Como Atualizar

1. Modifique os arquivos da extensão
2. **Importante**: Aumente a versão no `manifest.json`
   ```json
   {
     "version": "1.1.0"  // Era 1.0.0
   }
   ```
3. Crie um novo arquivo ZIP
4. No Developer Dashboard, vá até sua extensão
5. Clique em **"Upload Updated Package"**
6. Faça upload do novo ZIP
7. Atualize as informações se necessário
8. Clique em **"Submit for Review"**

### 10.3 Versionamento Semântico

Siga o padrão `MAJOR.MINOR.PATCH`:

- **MAJOR** (1.0.0 → 2.0.0): Mudanças grandes e incompatíveis
- **MINOR** (1.0.0 → 1.1.0): Novos recursos compatíveis
- **PATCH** (1.0.0 → 1.0.1): Correções de bugs

---

## 📞 Suporte e Recursos

### Links Úteis

- **Developer Dashboard**: https://chrome.google.com/webstore/devconsole
- **Documentação Oficial**: https://developer.chrome.com/docs/webstore/
- **Políticas da Chrome Web Store**: https://developer.chrome.com/docs/webstore/program-policies/
- **Fórum de Desenvolvedores**: https://groups.google.com/a/chromium.org/g/chromium-extensions

### Dicas Profissionais

1. **Teste antes de publicar**: Use o modo desenvolvedor no Chrome para testar
2. **Screenshots de qualidade**: Imagens profissionais aumentam instalações
3. **Descrição clara**: Seja específico sobre o que a extensão faz
4. **Atualizações regulares**: Mantenha a extensão atualizada
5. **Responda feedback**: Usuários valorizam desenvolvedores ativos

---

## ❓ Problemas Comuns

### Erro: "Manifest file is missing or unreadable"

**Solução**: Certifique-se de que o `manifest.json` está na raiz do ZIP

### Erro: "Invalid icon size"

**Solução**: Verifique se os ícones têm exatamente 48x48 e 128x128 pixels

### Erro: "Permission warnings"

**Solução**: Justifique cada permissão na seção de privacidade

### Extensão não aparece na busca

**Solução**: Pode levar até 24 horas após publicação. Verifique se está "Public"

---

## ✨ Checklist Rápido

Use este checklist para não esquecer nada:

- [ ] Conta de desenvolvedor criada e taxa paga ($5)
- [ ] Arquivo ZIP criado corretamente
- [ ] Ícones 48x48 e 128x128 incluídos
- [ ] manifest.json validado
- [ ] Nome e descrição preenchidos
- [ ] Categoria selecionada
- [ ] Pelo menos 1 screenshot enviado
- [ ] Permissões justificadas
- [ ] Privacidade configurada
- [ ] Visibilidade definida (Public)
- [ ] Revisão final feita
- [ ] Enviado para revisão

---

**Boa sorte com sua publicação! 🚀**

Se tiver dúvidas, consulte a documentação oficial ou entre em contato com o suporte do Chrome Web Store.
