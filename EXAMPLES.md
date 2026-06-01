# Exemplos de Uso

## 🔐 Autenticação

### Fazer Login
```javascript
import { useAuth } from '../contexts/AuthContext';

export const MyLoginComponent = () => {
  const { login } = useAuth();
  
  const handleLogin = async () => {
    const result = await login('user@email.com', 'password123');
    if (result.success) {
      // Sucesso! O usuário será automaticamente redirecionado
    } else {
      Alert.alert('Erro', result.error);
    }
  };
  
  return <Button title="Login" onPress={handleLogin} />;
};
```

### Verificar se Autenticado
```javascript
import { useAuth } from '../contexts/AuthContext';

export const MyComponent = () => {
  const { isSignedIn, user } = useAuth();
  
  if (!isSignedIn) {
    return <Text>Faça login para continuar</Text>;
  }
  
  return <Text>Bem-vindo, {user.name}!</Text>;
};
```

## 📸 Câmera

### Capturar Foto
```javascript
import { CameraService } from '../services/CameraService';

export const PhotoCapture = ({ cameraRef }) => {
  const handleCapture = async () => {
    const photo = await CameraService.takePunchPhoto(cameraRef);
    if (photo) {
      console.log('Foto capturada:', photo.uri);
      // Fazer algo com a foto
    }
  };
  
  return <Button title="Capturar" onPress={handleCapture} />;
};
```

## 📍 Localização

### Obter Localização Atual
```javascript
import { LocationService } from '../services/LocationService';

export const GetLocationComponent = () => {
  const handleGetLocation = async () => {
    const location = await LocationService.getCurrentLocation();
    if (location) {
      console.log('Latitude:', location.latitude);
      console.log('Longitude:', location.longitude);
    }
  };
  
  return <Button title="Obter Localização" onPress={handleGetLocation} />;
};
```

### Formatar Coordenadas
```javascript
import { LocationService } from '../services/LocationService';

const coords = LocationService.formatCoordinates(-23.5505, -46.6333);
console.log(coords); // -23.550500, -46.633300
```

## 🔐 Biometria

### Autenticar com Biometria
```javascript
import { BiometricService } from '../services/BiometricService';

export const BiometricAuth = () => {
  const handleBiometricAuth = async () => {
    const success = await BiometricService.authenticate();
    if (success) {
      console.log('Autenticação bem-sucedida');
    } else {
      console.log('Autenticação falhou');
    }
  };
  
  return <Button title="Autenticar" onPress={handleBiometricAuth} />;
};
```

### Verificar Disponibilidade
```javascript
import { BiometricService } from '../services/BiometricService';
import { useEffect, useState } from 'react';

export const BiometricCheck = () => {
  const [available, setAvailable] = useState(false);
  
  useEffect(() => {
    const check = async () => {
      const isAvailable = await BiometricService.isBiometricAvailable();
      setAvailable(isAvailable);
    };
    check();
  }, []);
  
  return <Text>{available ? 'Biometria disponível' : 'Não disponível'}</Text>;
};
```

## 🎯 Ponto (Punch)

### Registrar Batida de Ponto
```javascript
import { PunchService } from '../services/PunchService';

const recordNewPunch = async (photoData, locationData, userId) => {
  const result = await PunchService.recordPunch(
    photoData,
    locationData,
    userId
  );
  
  if (result.success) {
    console.log('Ponto registrado:', result.data);
    console.log('Horário:', PunchService.formatTime(result.data.timestamp));
  }
};
```

### Obter Batidas do Dia
```javascript
import { PunchService } from '../services/PunchService';

const getTodayPunches = async (userId) => {
  const punches = await PunchService.getTodayPunches(userId);
  console.log('Batidas de hoje:', punches);
  
  // Iterar sobre as batidas
  punches.forEach(punch => {
    console.log(`${PunchService.formatTime(punch.timestamp)} em ${punch.location.latitude}`);
  });
};
```

### Calcular Horas Pendentes
```javascript
import { PunchService } from '../services/PunchService';

const pending = PunchService.calculatePendingHours(userId);
console.log(`Horas pendentes: ${pending}h`);
```

## 🎨 Componentes Personalizados

### Usando Button
```javascript
import { Button } from '../components/Button';

<Button
  title="Clique aqui"
  onPress={() => handlePress()}
  style={{ marginTop: 10 }}
  disabled={loading}
/>
```

### Usando Input
```javascript
import { Input } from '../components/Input';

<Input
  placeholder="Digite seu email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  autoCapitalize="none"
/>
```

### Usando PunchCard
```javascript
import { PunchCard } from '../components/PunchCard';

<PunchCard
  time="14:30"
  location="-23.5505, -46.6333"
  photo={true}
  onDelete={() => deletePunch(id)}
/>
```

## 🔄 Fluxo Completo - Bater Ponto

```javascript
import React, { useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CameraView } from 'expo-camera';
import {
  LocationService,
  CameraService,
  BiometricService,
  PunchService,
} from '../services';
import { Button } from '../components';

export const CompletePunchFlow = ({ navigation }) => {
  const { user } = useAuth();
  const cameraRef = useRef(null);
  
  const handlePunchClock = async () => {
    try {
      // 1. Autenticar
      const authenticated = await BiometricService.authenticate();
      if (!authenticated) throw new Error('Autenticação falhou');
      
      // 2. Capturar foto
      const photo = await CameraService.takePunchPhoto(cameraRef);
      if (!photo) throw new Error('Falha ao capturar foto');
      
      // 3. Obter localização
      const location = await LocationService.getCurrentLocation();
      if (!location) throw new Error('Localização indisponível');
      
      // 4. Registrar ponto
      const result = await PunchService.recordPunch(photo, location, user.id);
      if (!result.success) throw new Error(result.error);
      
      // 5. Sucesso!
      Alert.alert('Sucesso', 'Ponto batido com sucesso!');
      navigation.goBack();
      
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };
  
  return (
    <CameraView ref={cameraRef}>
      <Button title="BATER PONTO" onPress={handlePunchClock} />
    </CameraView>
  );
};
```

## 🐛 Tratamento de Erros

### Try/Catch Seguro
```javascript
try {
  const location = await LocationService.getCurrentLocation();
  if (!location) {
    throw new Error('Localização não disponível');
  }
} catch (error) {
  console.error('Erro:', error.message);
  Alert.alert('Erro de Localização', 'Não foi possível obter sua localização');
}
```

### Com Retry
```javascript
const retryAsync = async (fn, maxAttempts = 3) => {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxAttempts - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

// Usar
const location = await retryAsync(
  () => LocationService.getCurrentLocation(),
  3
);
```

## 📚 Mais Exemplos

Veja [DEVELOPMENT.md](./DEVELOPMENT.md) para mais exemplos de desenvolvimento.

---

**Criado para facilitar a implementação de funcionalidades comuns**
