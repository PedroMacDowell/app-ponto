## 🎯 Instruções para Desenvolvimento

Este é um projeto de aplicativo mobile para controle de ponto de funcionários usando React Native + Expo.

### 📋 Stack Tecnológico
- **Framework**: React Native
- **CLI**: Expo
- **Navigation**: React Navigation
- **State**: Context API + AsyncStorage
- **Storage**: Async Storage (local)
- **Features**: Câmera, Localização, Biometria

### 📁 Estrutura de Pastas
```
src/
├── screens/          # Telas do app
├── components/       # Componentes reutilizáveis
├── services/         # Lógica de negócio
├── contexts/         # Estado global
└── utils/            # Utilitários
```

### 🚀 Comandos Principais
- `npm start` - Iniciar servidor Expo
- `npm run android` - Rodar no Android
- `npm run ios` - Rodar no iOS
- `npm run web` - Rodar na web

### ✅ Funcionalidades Implementadas
- ✅ Login/Cadastro
- ✅ Dashboard com estatísticas
- ✅ Câmera frontal
- ✅ Geolocalização
- ✅ Biometria (Face ID/Fingerprint)
- ✅ Registro de ponto com foto + local + horário

### 📝 Convenções de Código
- Componentes: PascalCase (ex: `Button.js`)
- Funções: camelCase (ex: `handleLogin()`)
- Contextos: `*Context.js`
- Serviços: `*Service.js`
- Telas: `*Screen.js`

### 🔍 Ao Adicionar Funcionalidades
1. Mantenha o projeto organizado
2. Crie novos serviços para lógica complexa
3. Reutilize componentes
4. Atualize a documentação
5. Teste em dispositivo real

### 📚 Documentação
- [README.md](../README.md) - Visão geral
- [SETUP.md](../SETUP.md) - Instalação e execução
- [DEVELOPMENT.md](../DEVELOPMENT.md) - Guia de desenvolvimento
