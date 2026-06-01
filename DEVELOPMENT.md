# Guia de Desenvolvimento

## 🏗️ Arquitetura do Projeto

### Camadas

#### 1. **Screens** (Telas)
- Componentes de tela completa que representam rotas
- Gerenciam estado local da tela
- Integram contextos e serviços

```javascript
// src/screens/DashboardScreen.js
import { useAuth } from '../contexts/AuthContext';
import { PunchService } from '../services/PunchService';
```

#### 2. **Components** (Componentes)
- Componentes reutilizáveis
- Sem lógica de negócio
- Props bem definidas

```javascript
// src/components/Button.js
export const Button = ({ onPress, title, style, disabled }) => {
  // Implementação
};
```

#### 3. **Services** (Serviços)
- Lógica de negócio
- Integração com APIs
- Acesso a dispositivos (câmera, localização, etc)

```javascript
// src/services/PunchService.js
export const PunchService = {
  async recordPunch(photoData, locationData, userId) {
    // Implementação
  }
};
```

#### 4. **Contexts** (Estado Global)
- Autenticação
- Temas
- Configurações globais

```javascript
// src/contexts/AuthContext.js
export const AuthProvider = ({ children }) => {
  // Estado e funções
};
```

## 📱 Fluxo de Dados

```
Tela (Screen)
    ↓
    ├→ useAuth() [Contexto]
    ├→ useEffect() [Buscar dados]
    ├→ Serviços [PunchService, LocationService, etc]
    └→ Renderizar Componentes
         ↓
         Componentes Reutilizáveis [Button, Input, etc]
```

## 🔄 Ciclo de Vida - Bater Ponto

```
Dashboard
    ↓
Usuario clica "BATER PONTO"
    ↓
PunchCameraScreen abre
    ↓
1. Solicita permissão de localização → LocationService
2. Ativa câmera frontal
3. Usuario posiciona rosto
    ↓
Usuario clica "CONFIRMAR PONTO"
    ↓
1. BiometricService.authenticate() → Autentica biometria
2. CameraService.takePunchPhoto() → Captura foto
3. LocationService.getCurrentLocation() → Obter local
4. PunchService.recordPunch() → Registra tudo
    ↓
Sucesso! Volta ao Dashboard
```

## 🛠️ Modificando o Projeto

### Adicionar Nova Tela

1. **Criar arquivo em `src/screens/`**

```javascript
// src/screens/MyNewScreen.js
import React from 'react';
import { View, Text } from 'react-native';

export const MyNewScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Minha Nova Tela</Text>
    </View>
  );
};
```

2. **Adicionar rota em `App.js`**

```javascript
<Stack.Screen name="MyNewScreen" component={MyNewScreen} />
```

3. **Navegar para ela**

```javascript
navigation.navigate('MyNewScreen');
```

### Adicionar Novo Componente

1. **Criar arquivo em `src/components/`**

```javascript
// src/components/MyComponent.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const MyComponent = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

2. **Usar em qualquer lugar**

```javascript
import { MyComponent } from '../components/MyComponent';

// Em uma tela
<MyComponent title="Teste" />
```

### Adicionar Novo Serviço

1. **Criar arquivo em `src/services/`**

```javascript
// src/services/MyService.js
export const MyService = {
  async doSomething() {
    // Implementação
  },
  
  async fetchData() {
    // Chamada a API
  }
};
```

2. **Usar em componentes/telas**

```javascript
import { MyService } from '../services/MyService';

// Em um useEffect
const data = await MyService.fetchData();
```

### Modificar Estilos

```javascript
// Cores principais
const colors = {
  primary: '#007AFF',
  success: '#34C759',
  danger: '#FF3B30',
  warning: '#FF9500',
  light: '#f5f5f5',
  dark: '#000',
};

// Aplicar em StyleSheet
const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
  },
});
```

## 🔐 Autenticação

### Fluxo

```
LoginScreen
    ↓
user@email.com + senha123
    ↓
AuthContext.login()
    ↓
1. Valida credenciais
2. Cria token
3. Salva em AsyncStorage
4. Atualiza useAuth()
    ↓
Dashboard (automaticamente redireciona)
```

### Adicionar autenticação em nova tela

```javascript
import { useAuth } from '../contexts/AuthContext';

export const MyScreen = () => {
  const { user, logout, isSignedIn } = useAuth();
  
  if (!isSignedIn) {
    return <Text>Você precisa fazer login</Text>;
  }
  
  return <Text>Bem-vindo {user.name}</Text>;
};
```

## 🚀 Deploy

### Android

```bash
# Compilar APK
eas build --platform android

# Instalar no dispositivo
eas submit --platform android
```

### iOS

```bash
# Compilar IPA
eas build --platform ios

# Enviar para App Store
eas submit --platform ios
```

## 🐛 Debug

### Erro em Produção

1. Use `console.error()` para logar erros
2. Capture em serviço de erro (Sentry, etc)
3. Use React DevTools

```javascript
// src/services/ErrorService.js
export const ErrorService = {
  logError(error, context) {
    console.error(`[${context}]`, error);
    // Enviar para serviço de erro
  }
};
```

### Debugar Autenticação

```javascript
// Adicionar logs
const login = async (email, password) => {
  console.log('Tentando fazer login com:', email);
  // ...
  console.log('Login bem-sucedido:', user);
};
```

## 📊 Integrar com API Backend

### Criar serviço de API

```javascript
// src/services/ApiService.js
import axios from 'axios';

const API_URL = 'https://seu-api.com/api';

export const ApiService = {
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};
```

### Usar em Contexto

```javascript
import { ApiService } from '../services/ApiService';

const login = async (email, password) => {
  const data = await ApiService.login(email, password);
  // Salvar dados
};
```

## 📚 Recursos Importantes

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Guide](https://docs.expo.dev/guides/overview/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Async Storage](https://react-native-async-storage.github.io/async-storage/)

## 🎯 Boas Práticas

✅ **Faça:**
- Mantenha componentes pequenos e focados
- Use nomes descritivos para variáveis
- Estruture o projeto por features
- Trate erros adequadamente
- Teste em dispositivo real

❌ **Evite:**
- Props aninhadas muito profundas
- Lógica complexa em componentes
- Estado global para tudo
- Ignorar erros
- Usar emulador para testar câmera/localização

---

**Feliz desenvolvimento! 🎉**
