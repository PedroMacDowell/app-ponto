# App de Ponto - Controle de Attendance

Um aplicativo mobile completo para controle de ponto de funcionários com recursos avançados como autenticação biométrica, captura de foto, localização em tempo real e dashboard visual.

## 🚀 Funcionalidades

### ✅ Autenticação
- Login de funcionários
- Sistema de cadastro
- Armazenamento seguro de sessão

### 📸 Batida de Ponto
- Câmera frontal para captura de selfie
- Biometria facial (Face ID/Biometria)
- Geolocalização em tempo real (GPS)
- Registro de horário automático
- Armazenamento de foto + local + horário

### 📊 Dashboard
- Visualização de batidas de ponto do dia
- Horas trabalhadas vs horas pendentes
- Estatísticas semanais
- Histórico de pontos

### 🔐 Segurança
- Autenticação biométrica
- Permissões de câmera e localização
- Armazenamento local encriptado

## 📋 Requisitos

- Node.js (v14 ou superior)
- npm ou yarn
- Expo CLI
- Smartphone iOS (13+) ou Android (9+)

## 🛠️ Instalação

### 1. Instalar Dependências

```bash
npm install
# ou
yarn install
```

### 2. Instalar Expo CLI (se não tiver)

```bash
npm install -g expo-cli
```

### 3. Executar a Aplicação

```bash
npm start
# ou
yarn start
```

Após executar este comando, você verá um QR code. Use o aplicativo **Expo Go** no seu smartphone para escanear o código e visualizar o app.

### Para plataformas específicas:

```bash
# Apenas Android
npm run android

# Apenas iOS
npm run ios

# Web (não suporta câmera/localização)
npm run web
```

## 📁 Estrutura do Projeto

```
app-ponto/
├── src/
│   ├── screens/              # Telas do app
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── PunchCameraScreen.js
│   │   └── SplashScreen.js
│   ├── components/           # Componentes reutilizáveis
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── LoadingOverlay.js
│   │   └── PunchCard.js
│   ├── services/             # Serviços de negócio
│   │   ├── AuthService.js
│   │   ├── LocationService.js
│   │   ├── CameraService.js
│   │   ├── BiometricService.js
│   │   └── PunchService.js
│   ├── contexts/             # Context API
│   │   └── AuthContext.js
│   └── utils/                # Utilitários
├── App.js                    # Ponto de entrada
├── app.json                  # Configuração Expo
└── package.json              # Dependências
```

## 🎯 Fluxo da Aplicação

### 1. Autenticação
- Usuário faz login ou cadastro
- Credenciais são armazenadas localmente

### 2. Dashboard
- Visualiza pontos batidos do dia
- Vê horas trabalhadas e pendentes
- Acessa estatísticas semanais

### 3. Bater Ponto
- Clica em "BATER PONTO"
- Sistema solicita autenticação biométrica
- Câmera frontal é ativada
- Localização é capturada
- Foto + local + horário são registrados
- Feedback visual de sucesso

## 🔧 Configuração de Permissões

### Android (`app.json`)
```json
"permissions": [
  "android.permission.CAMERA",
  "android.permission.ACCESS_FINE_LOCATION",
  "android.permission.ACCESS_COARSE_LOCATION",
  "android.permission.USE_BIOMETRIC"
]
```

### iOS (configurado automaticamente via plugins)
- NSCameraUsageDescription
- NSLocationWhenInUseUsageDescription
- NSFaceIDUsageDescription

## 📱 Telas do Aplicativo

### Login
- Email e senha
- Validação de campos
- Link para cadastro

### Cadastro
- Nome completo
- Email
- Senha com confirmação
- Validações de segurança

### Dashboard
- Saudação personalizada
- Cards de horas pendentes e batidas
- Botão grande para bater ponto
- Histórico de batidas do dia
- Resumo semanal

### Câmera de Ponto
- Visualização da câmera frontal
- Círculo de detecção de rosto
- Exibição de localização atual
- Horário em tempo real
- Indicador de biometria
- Botão de confirmação

## 🔐 Dados Armazenados

- Sessão do usuário (AsyncStorage)
- Histórico de batidas de ponto
- Fotos capturadas (FileSystem)
- Dados de localização

## 🚀 Deploy

Para criar uma versão de produção:

```bash
eas build --platform android --build-type app-signing
# ou
eas build --platform ios --build-type app-signing
```

## 🤝 Contribuindo

Para adicionar novas funcionalidades:

1. Crie uma branch (`git checkout -b feature/AmazingFeature`)
2. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
3. Push para a branch (`git push origin feature/AmazingFeature`)
4. Abra um Pull Request

## 📝 Notas de Desenvolvimento

### Melhorias Futuras
- [ ] Integração com API backend
- [ ] Sincronização em tempo real
- [ ] Notificações push
- [ ] Relatórios PDF
- [ ] Suporte offline
- [ ] Temas claro/escuro
- [ ] Múltiplos idiomas
- [ ] Analytics avançados

### Troubleshooting

**Câmera não funciona**
- Verifique permissões do app
- Reinicie o app
- Teste em dispositivo real (emulador pode ter limitações)

**Localização não funciona**
- Verifique se o GPS está ativado
- Conceda permissão ao app
- Teste ao ar livre para melhor recepção

**Biometria não disponível**
- Cadastre sua biometria no dispositivo
- Verifique suporte do dispositivo

## 📄 Licença

Este projeto é licenciado sob a MIT License - veja o arquivo LICENSE para mais detalhes.

## 📞 Suporte

Para suporte, abra uma issue no repositório ou entre em contato conosco.

---

**Desenvolvido com ❤️ usando React Native + Expo**
