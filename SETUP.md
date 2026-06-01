# Guia de Instalação e Execução

## 📦 Pré-requisitos

Você precisa ter instalado:

- **Node.js** (v14 ou superior) - [Download](https://nodejs.org/)
- **npm** ou **yarn** (vem com Node.js)
- **Expo CLI** - `npm install -g expo-cli`
- **Smartphone** com Expo Go instalado ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

## 🚀 Passos para Executar

### 1. Instalar Dependências

Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

Isso pode levar alguns minutos. Espere até que todas as dependências sejam instaladas.

### 2. Iniciar o Servidor de Desenvolvimento

```bash
npm start
```

Você verá algo como:

```
Starting Expo CLI...
Scanning 19 folders for symlinks in /seu/caminho/app-ponto/node_modules (7ms)

Starting Metro Bundler on port 8081.
Press 'w' to open web, 'a' to open Android, or 'i' to open iOS emulator.
Press 'r' to restart the bundler, or 'R' to reset cache.
Press 'e' to clear the terminal.

Logs for your project will appear below. Press Ctrl+C to stop.
```

### 3. Abrir no Smartphone

A. **Via QR Code (recomendado)**
   - Abra o **Expo Go** no seu smartphone
   - Clique em "Scan QR code"
   - Aponte para o QR code que aparece no terminal
   - Aguarde o app carregar

B. **Via Link Direto**
   - Copie o link que aparece no terminal
   - Abra o **Expo Go** > "Scan" > Cole o link

### 4. Testar a Aplicação

**Credenciais de Teste:**
- Email: `teste@email.com`
- Senha: `senha123` (qualquer senha funciona no teste)

## 🧪 Testando as Funcionalidades

### ✅ Login/Cadastro
1. Use o email e qualquer senha
2. Clique em "Entrar"
3. Será redirecionado para o Dashboard

### 📊 Dashboard
- Visualize horas pendentes e batidas do dia
- Clique em "BATER PONTO"

### 📸 Câmera e Ponto
1. Clique em "BATER PONTO"
2. Permita acesso à câmera
3. Permita acesso à localização
4. Seu rosto será mostrado na câmera
5. Clique em "CONFIRMAR PONTO"
6. Se tiver biometria, autentique
7. A batida será registrada

### 🗑️ Deletar Batida
- No Dashboard, clique no ícone de lixeira
- Confirme a deleção

## 🐛 Troubleshooting

### "Command not found: npm"
- Instale Node.js do site oficial: https://nodejs.org/

### "expo command not found"
- Execute: `npm install -g expo-cli`

### Câmera preta/não funciona
- Use um dispositivo real (emuladores têm limitações)
- Verifique permissões: Configurações > App > Permissões > Câmera

### Localização não funciona
- Ative GPS no dispositivo
- Permita acesso ao GPS: Configurações > App > Permissões > Localização
- Saia de ambientes internos para melhor recepção

### Biometria não aparece
- Cadastre sua biometria no dispositivo (Face ID ou Fingerprint)
- Nem todos os dispositivos suportam biometria

### Conexão lenta/App congelado
- Verifique a conexão WiFi/Internet
- Reinicie o Expo Go: força-fechar e reabrir
- Reinicie o PC/Mac
- Limpe cache: `npm cache clean --force`

## 📱 Atalhos Úteis

No terminal do Expo:

| Tecla | Ação |
|-------|------|
| `w` | Abrir no navegador (Web) |
| `a` | Abrir no emulador Android |
| `i` | Abrir no emulador iOS |
| `r` | Reiniciar o app |
| `R` | Limpar cache e reiniciar |
| `e` | Limpar terminal |
| `Ctrl+C` | Parar o servidor |

## 🔧 Comandos Úteis

```bash
# Limpar cache
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# Verificar versão do Node
node --version

# Verificar versão do npm
npm --version

# Verificar instalação do Expo
expo --version
```

## 📖 Estrutura do Projeto

```
app-ponto/
├── src/                    # Código-fonte
│   ├── screens/           # Telas da aplicação
│   ├── components/        # Componentes reutilizáveis
│   ├── services/          # Serviços e lógica de negócio
│   ├── contexts/          # Context API para estado global
│   └── utils/             # Funções utilitárias
├── App.js                 # Ponto de entrada
├── app.json               # Configuração do Expo
├── package.json           # Dependências do projeto
└── README.md              # Documentação
```

## 🎯 Próximos Passos

1. **Explorar o código**: Abra os arquivos em `src/` para entender a estrutura
2. **Customizar**: Mude cores, textos e logos conforme necessário
3. **Conectar a API**: Atualize os serviços para conectar a um backend real
4. **Testar com dados reais**: Veja como o app se comporta em produção

## 📚 Recursos Úteis

- [Documentação Expo](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Expo Camera](https://docs.expo.dev/camera/overview/)
- [Expo Location](https://docs.expo.dev/location/overview/)
- [Expo Local Authentication](https://docs.expo.dev/local-authentication/overview/)

## 💡 Dicas

- Sempre teste em um dispositivo real, não apenas no emulador
- Mantenha o WiFi estável durante o desenvolvimento
- Use o React DevTools para debugar: https://docs.expo.dev/debugging/runtime-issues/
- Contribua com melhorias e reporte bugs

## ❓ Precisa de Ajuda?

- Verifique o README.md principal
- Consulte a documentação oficial do Expo
- Abra uma issue no repositório

---

**Bom desenvolvimento! 🚀**
