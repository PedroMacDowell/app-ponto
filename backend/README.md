# Backend - App Ponto

Servidor Node.js + Express para controle de ponto com segurança avançada.

## 🚀 Recursos

### Segurança
- ✅ Autenticação JWT
- ✅ Hash de Senhas (bcryptjs)
- ✅ Rate Limiting
- ✅ CORS + Helmet
- ✅ Validação de Fotos
- ✅ Detecção de Duplicatas
- ✅ Auditoria Completa
- ✅ Histórico de Logins

### Funcionalidades
- ✅ Registro de Usuários
- ✅ Login com Dispositivo
- ✅ Batida de Ponto
- ✅ Histórico de Pontos
- ✅ Detecção de Manipulação
- ✅ Logging de Auditoria
- ✅ Rejeição de Fotos Duplicadas

## 📋 Instalação

### 1. Instalar Node.js
Baixe em: https://nodejs.org/

### 2. Instalar MongoDB
Para testes locais:
```bash
# Windows
# Baixe de: https://www.mongodb.com/try/download/community

# Ou use Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### 3. Instalar Dependências
```bash
cd backend
npm install
```

### 4. Configurar Variáveis de Ambiente
```bash
cp .env.example .env
# Editar .env com suas configurações
```

### 5. Iniciar o Servidor
```bash
# Desenvolvimento com auto-reload
npm run dev

# Produção
npm start
```

O servidor estará rodando em `http://localhost:3000`

## 📚 API Endpoints

### Autenticação

#### POST /api/auth/register
Registrar novo usuário

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "confirmPassword": "senha123",
  "deviceId": "device_123",
  "deviceName": "Samsung Galaxy A12",
  "osVersion": "11.0",
  "appVersion": "1.0.0"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "token": "eyJhbGc...",
  "user": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

#### POST /api/auth/login
Fazer login

**Request:**
```json
{
  "email": "joao@email.com",
  "password": "senha123",
  "deviceId": "device_123",
  "deviceName": "Samsung Galaxy A12",
  "osVersion": "11.0"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "token": "eyJhbGc...",
  "user": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

#### GET /api/auth/verify
Verificar se token é válido

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Token válido",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "joao@email.com"
  }
}
```

### Pontos de Ponto

#### POST /api/punch
Criar batida de ponto

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "photoBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "location": {
    "latitude": -23.5505,
    "longitude": -46.6333,
    "accuracy": 10
  },
  "type": "entrada",
  "biometryType": "faceid",
  "deviceId": "device_123",
  "captureMethod": "camera"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ponto batido com sucesso",
  "punch": {
    "id": "507f1f77bcf86cd799439011",
    "punchId": "550e8400-e29b-41d4-a716-446655440001",
    "timestamp": "2024-06-01T14:30:00Z",
    "type": "entrada",
    "status": "confirmed"
  }
}
```

#### GET /api/punch/today
Obter pontos de hoje

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "punchId": "550e8400-e29b-41d4-a716-446655440001",
      "type": "entrada",
      "timestamp": "2024-06-01T08:00:00Z",
      "location": {
        "latitude": -23.5505,
        "longitude": -46.6333
      },
      "status": "confirmed"
    },
    {
      "punchId": "550e8400-e29b-41d4-a716-446655440002",
      "type": "saida",
      "timestamp": "2024-06-01T17:00:00Z",
      "location": {
        "latitude": -23.5505,
        "longitude": -46.6333
      },
      "status": "confirmed"
    }
  ]
}
```

#### GET /api/punch/history
Obter histórico de pontos

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate`: Data inicial (YYYY-MM-DD)
- `endDate`: Data final (YYYY-MM-DD)
- `limit`: Limite de resultados (padrão: 30)
- `offset`: Deslocamento (padrão: 0)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "limit": 30,
    "offset": 0
  }
}
```

## 🔒 Sistema de Segurança

### 1. Autenticação
- Senhas com hash bcryptjs
- Tokens JWT com expiração
- Verificação de token em cada requisição

### 2. Validação de Fotos
- Detecção de manipulação
- Detecção de rosto
- Validação de tamanho e formato
- Hash MD5 para detecção de duplicatas

### 3. Detecção de Duplicatas
- Uma mesma foto não pode ser usada 2x em 24h
- Sistema de hash previne cópias da galeria
- Alerta se foto suspeita

### 4. Auditoria
- Todos os logins registrados
- Histórico de dispositivos
- Log de todas as ações
- Rastreamento de IP

### 5. Rate Limiting
- 5 tentativas de login por IP em 15 min
- 100 requisições por IP em 1 min
- 3 batidas de ponto por minuto

## 📊 Modelos de Dados

### User
```
{
  userId: String (UUID)
  name: String
  email: String
  password: String (hashed)
  company: String
  department: String
  deviceInfo: {
    deviceId: String
    deviceName: String
    osVersion: String
    appVersion: String
  }
  isActive: Boolean
  lastLogin: Date
  lastIp: String
  loginHistory: Array
  createdAt: Date
  updatedAt: Date
}
```

### Punch
```
{
  punchId: String (UUID)
  userId: ObjectId
  userEmail: String
  type: String (entrada, saida, intervalo, retorno)
  timestamp: Date
  photo: {
    filename: String
    hash: String
    size: Number
    mimeType: String
  }
  location: {
    latitude: Number
    longitude: Number
    accuracy: Number
    address: String
  }
  security: {
    captureMethod: String (camera, gallery, unknown)
    faceDetection: Object
    biometryType: String
    validated: Boolean
    deviceId: String
    deviceHash: String
  }
  status: String (confirmed, pending, rejected, duplicate)
  createdAt: Date
  updatedAt: Date
}
```

### AuditLog
```
{
  logId: String (UUID)
  userId: String
  email: String
  action: String
  description: String
  data: Object
  status: String (success, warning, error)
  ipAddress: String
  deviceId: String
  userAgent: String
  createdAt: Date
}
```

## 🧪 Testando a API

### Com cURL
```bash
# Registro
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "senha123",
    "confirmPassword": "senha123",
    "deviceId": "device_123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "senha123",
    "deviceId": "device_123"
  }'
```

### Com Postman
1. Importar a collection do Postman (veja `BACKEND.postman_collection.json`)
2. Configurar variáveis de ambiente
3. Testar endpoints

## 📖 Estrutura

```
backend/
├── src/
│   ├── controllers/      # Lógica dos endpoints
│   ├── models/           # Modelos MongoDB
│   ├── routes/           # Definição de rotas
│   ├── middleware/       # Autenticação, rate limiting
│   ├── utils/            # Funções utilitárias
│   └── index.js          # Servidor principal
├── logs/                 # Arquivos de log
├── package.json
├── .env.example
└── .gitignore
```

## 🔧 Variáveis de Ambiente

```env
DATABASE_URL=mongodb://localhost:27017/app-ponto
PORT=3000
NODE_ENV=development
JWT_SECRET=sua_secret_aqui
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
API_LOG_LEVEL=info
CORS_ORIGIN=*
```

## 🚀 Deploy

### Heroku
```bash
# Criar app
heroku create seu-app-ponto

# Configurar variáveis
heroku config:set JWT_SECRET=sua_secret

# Fazer push
git push heroku main
```

### DigitalOcean/AWS
1. Deploy via PM2 para auto-restart
2. Usar nginx como proxy reverso
3. SSL com Let's Encrypt

## 📝 Logs

Os logs são salvos em:
- `logs/error.log` - Apenas erros
- `logs/combined.log` - Todos os logs
- Console - Output em tempo real

## 🐛 Troubleshooting

**Erro: "Cannot connect to MongoDB"**
- Verificar se MongoDB está rodando
- Verificar DATABASE_URL

**Erro: "Token inválido"**
- Regenerar token
- Verificar JWT_SECRET

**Erro: "Rate limit exceeded"**
- Aguardar 15 minutos para nova tentativa

## 📚 Próximas Melhorias

- [ ] Integração com S3 para armazenar fotos
- [ ] ML para detecção de rosto mais precisa
- [ ] Integração com serviço de email
- [ ] Dashboard de admin
- [ ] Relatórios avançados
- [ ] Notificações push

---

**Desenvolvido com Node.js + Express + MongoDB**
