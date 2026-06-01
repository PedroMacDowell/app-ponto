# Guia de Integração Frontend com Backend

Este documento explica como usar os serviços do backend no frontend.

## 🔌 Configurar URL da API

### 1. Variável de Ambiente
Criar arquivo `.env` na raiz do projeto:

```
REACT_APP_API_URL=http://localhost:3000/api
```

Para testes em casa na rede Wi-Fi:
```
REACT_APP_API_URL=http://seu-ip-local:3000/api
```

### 2. No App.js
```javascript
import { ApiService } from './src/services/logger/ApiService';
```

## 📱 Usando os Serviços

### LocalLogger - Logs Locais

```javascript
import { LocalLogger } from './src/services/logger/LocalLogger';

// Log de ponto
await LocalLogger.log('PUNCHES', 'Ponto batido', {
  punchId: 'abc123',
  type: 'entrada',
});

// Obter todos os logs de ponto
const logs = await LocalLogger.getPunchLogs();

// Exportar logs
const logsPath = await LocalLogger.exportLogs();

// Limpar logs
await LocalLogger.clearAllLogs();
```

### ApiService - Requisições

```javascript
import { ApiService } from './src/services/logger/ApiService';

// Registro
const result = await ApiService.register(
  'João Silva',
  'joao@email.com',
  'senha123',
  'senha123'
);

// Login
const loginResult = await ApiService.login('joao@email.com', 'senha123');

// Bater ponto
const punchResult = await ApiService.createPunch(
  photoBase64,
  location,
  'entrada',
  'faceid'
);

// Obter pontos de hoje
const todayPunches = await ApiService.getTodayPunches();

// Histórico
const history = await ApiService.getPunchHistory(
  '2024-06-01',
  '2024-06-30',
  30,
  0
);
```

### PhotoSecurityService - Validação de Fotos

```javascript
import { PhotoSecurityService } from './src/services/logger/PhotoSecurityService';

// Gerar hash
const hash = PhotoSecurityService.generatePhotoHash(photoBase64);

// Detectar manipulação
const result = await PhotoSecurityService.detectManipulation(photoBase64);

// Comparar fotos
const same = PhotoSecurityService.comparePhotos(hash1, hash2);
```

## 🎯 Fluxo Completo de Batida de Ponto

```javascript
import React, { useRef } from 'react';
import { ApiService } from '../services/logger/ApiService';
import { PhotoSecurityService } from '../services/logger/PhotoSecurityService';
import { LocalLogger } from '../services/logger/LocalLogger';
import { CameraService } from '../services/CameraService';
import { LocationService } from '../services/LocationService';

export const CompletePunchFlow = ({ navigation }) => {
  const cameraRef = useRef(null);

  const handlePunchWithBackend = async () => {
    try {
      // 1. Capturar foto
      const photo = await CameraService.takePunchPhoto(cameraRef);
      if (!photo) throw new Error('Falha ao capturar foto');

      // 2. Obter localização
      const location = await LocationService.getCurrentLocation();
      if (!location) throw new Error('Localização indisponível');

      // 3. Validar foto
      const photoValidation = await PhotoSecurityService.detectManipulation(
        photo.base64
      );
      
      if (photoValidation.suspicious) {
        Alert.alert('Aviso', 'Foto pode estar manipulada');
      }

      // 4. Gerar hash
      const photoHash = PhotoSecurityService.generatePhotoHash(photo.base64);

      // 5. Enviar para backend
      const result = await ApiService.createPunch(
        photo.base64,
        location,
        'entrada',
        'faceid'
      );

      if (result.success) {
        Alert.alert('Sucesso', 'Ponto batido com sucesso!');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return <Button title="BATER PONTO" onPress={handlePunchWithBackend} />;
};
```

## 🔐 Segurança

### O que o Backend Faz
- ✅ Hash de senhas
- ✅ Validação de token JWT
- ✅ Detecção de duplicatas (mesmo hash)
- ✅ Rate limiting (proteção contra força bruta)
- ✅ Registro de auditoria
- ✅ Validação de tamanho/formato de foto

### O que o Frontend Faz
- ✅ Validação local de entrada
- ✅ Detecção de manipulação de foto
- ✅ Logging local
- ✅ Verificação de câmera vs galeria

## 📊 Monitoramento e Logs

### Ver Logs Locais
```javascript
// Obter todos os logs
const authLogs = await LocalLogger.getAuthLogs();
const punchLogs = await LocalLogger.getPunchLogs();
const errorLogs = await LocalLogger.getErrorLogs();

// Listar no console
console.log('Logs de Auth:', authLogs);
console.log('Logs de Ponto:', punchLogs);
```

### Logs do Backend
Acessar em `backend/logs/`:
- `combined.log` - Todos os eventos
- `error.log` - Apenas erros

## 🧪 Testar Integração

### 1. Iniciar Backend
```bash
cd backend
npm run dev
```

### 2. Iniciar Frontend
```bash
npm start
```

### 3. Registrar Usuário
- Email: `teste@email.com`
- Senha: `123456`

### 4. Fazer Login
- Usar as credenciais acima

### 5. Bater Ponto
- Clique em "BATER PONTO"
- Capturar foto
- Ponto será enviado ao backend

### 6. Verificar Logs
```javascript
// No console do app
const logs = await LocalLogger.getPunchLogs();
console.log(logs);
```

## 🔍 Verificar se Backend Está Funcionando

Acessar em um navegador:
```
http://localhost:3000/health
```

Resposta esperada:
```json
{
  "status": "OK",
  "timestamp": "2024-06-01T14:30:00.000Z"
}
```

## 🚨 Erros Comuns

### "Cannot connect to API"
- Verificar se backend está rodando
- Verificar URL da API no `.env`
- Verificar firewall

### "Token inválido"
- Fazer login novamente
- Limpar AsyncStorage

### "Foto manipulada"
- Usar câmera frontal em vez de galeria
- Capturar com boa iluminação

## 📈 Métricas

### Logs de Login
```javascript
const authLogs = await LocalLogger.getAuthLogs();
const failedLogins = authLogs.filter(l => !l.data.success);
console.log(`Logins falhados: ${failedLogins.length}`);
```

### Pontos Batidos
```javascript
const punchLogs = await LocalLogger.getPunchLogs();
console.log(`Total de pontos: ${punchLogs.length}`);
```

## 💡 Dicas

1. Sempre verificar logs antes de debugar
2. Usar LocalLogger para rastrear erros
3. Backend valida TUDO, confiar nele
4. Manter JWT_SECRET seguro
5. Regenerar token a cada login

---

**Próxima: Veja BACKEND.md para configurar o servidor**
