# 📱 App Ponto - Sistema de Controle de Attendance

> Sistema profissional de controle de ponto de funcionários com autenticação segura, biometria, validação de fotos, geolocalização e auditoria completa.

**[🚀 QUICKSTART](QUICKSTART.md)** • **[🔧 Backend](backend/README.md)** • **[📋 TODO](TODO.md)**

---

## 🎯 O Que Você Tem

### Frontend ✅
- 5 telas (Login, Cadastro, Dashboard, Câmera, Splash)
- Câmera frontal em tempo real
- Biometria (Face ID/Fingerprint)
- Geolocalização com GPS
- Logging local completo
- AsyncStorage para persistência

### Backend ✅
- API REST (Node.js + Express + MongoDB)
- Autenticação JWT segura
- Hash bcryptjs para senhas
- Rate limiting (proteção contra força bruta)
- Detecção de fotos manipuladas
- Auditoria completa de eventos
- Logs estruturados (Winston)

### Segurança ✅
- ✅ Senhas hashed (bcryptjs - 10 rounds)
- ✅ Tokens JWT (expiração 7 dias)
- ✅ Detecção de duplicatas (hash MD5)
- ✅ Rate limiting (5 tentativas/15min)
- ✅ Histórico de logins
- ✅ IPs registrados
- ✅ Auditoria de eventos
- ✅ Validação foto (tamanho, formato, conteúdo)

---

## 📦 Estrutura do Projeto

```
app-ponto/
├── src/                           # Frontend (React Native)
│   ├── screens/                  # 5 telas
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── PunchCameraScreen.js
│   │   └── SplashScreen.js
│   ├── components/               # 4 componentes
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── LoadingOverlay.js
│   │   └── PunchCard.js
│   ├── services/                 # Serviços
│   │   ├── AuthContext.js
│   │   ├── LocationService.js
│   │   ├── CameraService.js
│   │   ├── BiometricService.js
│   │   ├── PunchService.js
│   │   └── logger/
│   │       ├── LocalLogger.js
│   │       ├── ApiService.js
│   │       └── PhotoSecurityService.js
│   └── contexts/
│       └── AuthContext.js
│
├── backend/                       # Backend (Node.js)
│   └── src/
│       ├── controllers/          # Lógica
│       │   ├── authController.js
│       │   └── punchController.js
│       ├── models/               # MongoDB
│       │   ├── User.js
│       │   ├── Punch.js
│       │   └── AuditLog.js
│       ├── routes/               # Rotas
│       │   ├── authRoutes.js
│       │   └── punchRoutes.js
│       ├── middleware/           # Autenticação
│       │   ├── auth.js
│       │   └── rateLimiter.js
│       ├── utils/
│       │   ├── logger.js
│       │   └── photoValidation.js
│       └── index.js              # Servidor
│
├── README.md                      # Este arquivo
├── QUICKSTART.md                  # ⚡ Começar em 5 min
├── TODO.md                        # 📋 Ideias futuras
├── backend/README.md              # 🔧 API Reference
├── App.js                         # Entrada (Frontend)
├── app.json                       # Config Expo
├── package.json                   # Deps Frontend
└── .github/
    └── copilot-instructions.md   # Instruções Copilot
```

---

## 🚀 Começar Rápido

### Opção 1: Guia Passo a Passo (Recomendado)
👉 **[Veja QUICKSTART.md](QUICKSTART.md)** para começar em 5 minutos

### Opção 2: Manual (Desenvolvedor)

#### Terminal 1: Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
# Esperado: ✓ MongoDB conectado, Servidor na porta 3000
```

#### Terminal 2: Frontend
```bash
npm install
npm start
# Esperado: ✓ QR code no terminal, Expo aberto
```

#### Celular
1. Abra **Expo Go**
2. Escaneie o **QR code**
3. App abre automaticamente

#### Testar
- Email: `teste@email.com`
- Senha: `123456` (qualquer senha em teste)
- Clique em "Entrar"
- Clique em "BATER PONTO"

---

## 📱 Funcionalidades por Tela

### 🔐 Login/Cadastro
```
LoginScreen
├── Email + Senha
├── Validação
└── Link para cadastro

RegisterScreen
├── Nome + Email + Senha
├── Confirmação
└── Link para login
```

### 📊 Dashboard
```
DashboardScreen
├── Bem-vindo [Usuário]
├── Cards
│   ├── Horas Pendentes
│   └── Batidas Hoje
├── Botão "BATER PONTO"
├── Lista de Pontos do Dia
├── Resumo Semanal
└── Botão Logout
```

### 📸 Câmera de Ponto
```
PunchCameraScreen
├── Câmera frontal (preview)
├── Círculo de detecção de rosto
├── Localização (latitude, longitude)
├── Horário em tempo real
├── Status de Biometria
└── Botão "CONFIRMAR PONTO"
     ├── Autentifica biometria
     ├── Captura foto
     ├── Obtém localização
     ├── Valida no backend
     └── Registra ponto
```

---

## 🔒 Sistema de Segurança

### Frontend
- Validação de entrada
- Detecção de manipulação de foto
- Logging local
- Verificação câmera vs galeria

### Backend
- Autenticação JWT
- Hash bcryptjs
- Rate limiting
- Detecção de duplicatas (hash MD5)
- Auditoria completa
- Histórico de logins
- IPs registrados

| Recurso | Detalhe |
|---------|--------|
| **Senhas** | Bcryptjs (10 rounds) |
| **Tokens** | JWT (7 dias expiração) |
| **Fotos** | Hash MD5 + Validação |
| **Login** | 5 tentativas/15 min |
| **Ponto** | 3 batidas/min |
| **Detecção** | Duplicatas em 24h |
| **Logs** | Auditoria completa |

---

## 📊 Fluxo de Dados

### 1. Registro de Novo Usuário
```
Frontend (Cadastro)
    ↓
Validação local
    ↓
Backend → Registra usuário
    ↓
Hash senha (bcryptjs)
    ↓
Gera UUID único
    ↓
Retorna token JWT
    ↓
Frontend → Login automático
```

### 2. Fazer Login
```
Frontend (Login)
    ↓
Email + Senha
    ↓
Backend → Verifica email
    ↓
Compara senha hasheada
    ↓
Registra tentativa
    ↓
Gera token JWT
    ↓
Frontend → Salva token + dados
    ↓
Dashboard aberto
```

### 3. Bater Ponto
```
Frontend (Câmera)
    ↓
Captura foto (câmera frontal)
    ↓
Obtém localização (GPS)
    ↓
Autenticação biométrica
    ↓
Gera hash MD5 da foto
    ↓
Backend → Recebe ponto
    ↓
Valida foto
    ↓
Detecta duplicatas
    ↓
Registra em MongoDB
    ↓
Auditoria com IP + Device
    ↓
Retorna sucesso
    ↓
Frontend → Exibe histórico
```

---

## 💻 Exemplos de Código

### Login no App
```javascript
import { useAuth } from '../contexts/AuthContext';

export const MyScreen = () => {
  const { login, user, isSignedIn } = useAuth();
  
  const handleLogin = async () => {
    const result = await login('email@email.com', 'senha123');
    if (result.success) {
      // Usuário logado! Ir para Dashboard
    }
  };
  
  return isSignedIn ? <Dashboard /> : <LoginForm />;
};
```

### Bater Ponto com Backend
```javascript
import { ApiService } from '../services/logger/ApiService';

const handlePunch = async () => {
  try {
    const result = await ApiService.createPunch(
      photoBase64,
      location,
      'entrada',
      'faceid'
    );
    
    if (result.success) {
      Alert.alert('Sucesso', 'Ponto batido!');
    }
  } catch (error) {
    Alert.alert('Erro', error.message);
  }
};
```

### Acessar Logs Locais
```javascript
import { LocalLogger } from '../services/logger/LocalLogger';

// Obter logs
const punchLogs = await LocalLogger.getPunchLogs();
const authLogs = await LocalLogger.getAuthLogs();

// Exportar
const path = await LocalLogger.exportLogs();

// Limpar
await LocalLogger.clearAllLogs();
```

---

## 🔌 API Endpoints

### Autenticação
```
POST   /api/auth/register      Registrar novo usuário
POST   /api/auth/login         Fazer login
GET    /api/auth/verify        Verificar token (com Authorization)
```

### Pontos
```
POST   /api/punch              Bater ponto (com foto + localização)
GET    /api/punch/today        Pontos de hoje
GET    /api/punch/history      Histórico completo
```

👉 **API completa**: [backend/README.md](backend/README.md)

---

## 🧪 Testando

### Credenciais de Teste
```
Email: teste@email.com
Senha: 123456 (qualquer coisa funciona em teste)
```

### Checklist de Teste
- [ ] Registrar novo usuário
- [ ] Fazer login
- [ ] Visualizar Dashboard
- [ ] Bater ponto (com foto + permissões)
- [ ] Ver histórico de pontos
- [ ] Fazer logout
- [ ] Fazer login novamente com outro usuário

---

## 📚 Documentação

| Arquivo | O Quê |
|---------|--------|
| **[QUICKSTART.md](QUICKSTART.md)** | ⚡ Começar em 5 minutos |
| **[backend/README.md](backend/README.md)** | 🔧 API Reference Completa |
| **[TODO.md](TODO.md)** | 📋 Ideias e Melhorias Futuras |

---

## 🐛 Troubleshooting

### "Cannot connect to API"
```bash
# Verificar se backend está rodando
curl http://localhost:3000/health

# Se falhar, execute no terminal do backend:
npm run dev
```

### "MongoDB connection failed"
```bash
# Verificar se MongoDB está rodando
# Windows: mongod
# Docker: docker run -p 27017:27017 mongo
```

### Câmera preta
- Usar **dispositivo real** (não emulador)
- Autorizar permissão nas configurações
- Reiniciar app

### Localização não funciona
- Ativar GPS
- Sair de ambientes fechados
- Aguardar 30 segundos

---

## 🛠️ Customização

### Mudar Cores
Editar em `src/screens/*.js`:
```javascript
backgroundColor: '#007AFF', // Sua cor aqui
```

### Adicionar Nova Tela
1. Criar arquivo em `src/screens/MyScreen.js`
2. Adicionar rota em `App.js`
3. Pronto!

### Integrar com API Real
Editar `src/services/logger/ApiService.js`:
```javascript
const API_BASE_URL = 'https://sua-api.com/api';
```

---

## 🚀 Deploy

### Backend (Heroku)
```bash
heroku create seu-app-ponto
heroku config:set JWT_SECRET=sua_chave_secreta
git push heroku main
```

### Frontend (Expo)
```bash
eas build --platform android
eas build --platform ios
```

---

## 📊 Stack Tecnológico

**Frontend:**
- React Native 0.73 + Expo 50
- React Navigation
- Context API + AsyncStorage
- Expo Camera, Location, Biometria

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT + Bcryptjs
- Winston Logger
- Rate Limiter

---

## 🎯 Recursos Implementados

| Recurso | Status |
|---------|--------|
| Autenticação JWT | ✅ |
| Senhas com hash | ✅ |
| Câmera frontal | ✅ |
| Geolocalização | ✅ |
| Biometria | ✅ |
| Detecção duplicata | ✅ |
| Rate limiting | ✅ |
| Auditoria | ✅ |
| Logging | ✅ |
| Validação foto | ✅ |

---

## 🚦 Status do Projeto

```
✅ v1.0 - Frontend completo
✅ v2.0 - Backend profissional
✅ v2.1 - Logging e Segurança
📋 v3.0 - Dashboard Admin
📋 v4.0 - Deploy Produção
```

---

## 🎉 Próximas Etapas

1. **Testar** → [QUICKSTART.md](QUICKSTART.md)
2. **Customizar** → Cores, logos, textos
3. **Expandir** → Novos tipos de ponto
4. **Integrar** → Sua API/RH
5. **Deploy** → Heroku/AWS/Azure

---

## 📞 Suporte

- [Expo Docs](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://docs.mongodb.com/)

---

**Desenvolvido com ❤️ usando React Native + Node.js + MongoDB**

v2.1.0 • Junho 2026 • [MIT License](LICENSE)
