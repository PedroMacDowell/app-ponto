# 🚀 Guia Rápido - Testando Tudo em Casa

Este guia te ajudará a rodar o app completo (frontend + backend) em sua casa.

## 📋 Pré-requisitos

- Node.js 14+
- MongoDB (local ou Docker)
- Smartphone com Expo Go
- WiFi com conexão à internet

## 🏃 Começar em 5 Minutos

### Passo 1: Verificar IP Local
```bash
# Windows
ipconfig

# Procure por "IPv4 Address" (exemplo: 192.168.1.100)
```

### Passo 2: Configurar Backend

```bash
cd backend
npm install

# Criar arquivo .env
cp .env.example .env

# Editar .env
# DATABASE_URL=mongodb://localhost:27017/app-ponto (ou seu MongoDB)
# PORT=3000
# JWT_SECRET=sua_chave_segura_aqui
```

### Passo 3: Iniciar MongoDB (se estiver local)

**Opção A: Instalado localmente**
```bash
# Windows
mongod
```

**Opção B: Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

### Passo 4: Iniciar Backend

```bash
cd backend
npm run dev

# Esperado:
# ✓ Conectado ao MongoDB
# ✓ Servidor rodando na porta 3000
```

### Passo 5: Configurar Frontend

```bash
# Na raiz do projeto (app-ponto)
# Editar arquivo com seu IP local

# Criar .env.local (se necessário)
# REACT_APP_API_URL=http://SEU_IP_LOCAL:3000/api
# Exemplo: http://192.168.1.100:3000/api
```

### Passo 6: Iniciar Frontend

```bash
npm start

# Esperado:
# ✓ Expo aberto
# ✓ QR code no terminal
```

### Passo 7: Abrir no Celular

1. Abra Expo Go no smartphone
2. Escaneie o QR code do terminal
3. O app abrirá em alguns segundos

## ✅ Testar Funcionalidades

### 1️⃣ Cadastro
- Email: `usuario@email.com`
- Senha: `123456`
- Confirmar: `123456`

### 2️⃣ Login
- Usar o email e senha acima
- Verificar se aparece "Bem-vindo!" no Dashboard

### 3️⃣ Dashboard
- Ver "Horas Pendentes"
- Ver "Batidas Hoje"
- Tudo deve funcionar

### 4️⃣ Bater Ponto
- Clique em "BATER PONTO"
- Permita acesso à câmera
- Permita acesso à localização
- Clique em "CONFIRMAR PONTO"
- Espere o sucesso

### 5️⃣ Histórico
- Volte ao Dashboard
- Você verá o ponto que bateu listado

## 🔍 Verificar Logs

### Backend
```bash
# Terminal do backend mostra tudo em tempo real
# Procure por: [info], [error], [warning]
```

### Frontend (Local Logger)
No app, abra console:
```javascript
// Digite no Chrome DevTools (F12)
// Quando usar web:
fetch('http://localhost:3000/health')
  .then(r => r.json())
  .then(d => console.log(d))
```

## 🐛 Troubleshooting

### "Cannot connect to API"
```bash
# Verificar se backend está rodando
curl http://localhost:3000/health

# Se não funcionar:
# 1. Verificar se backend está realmente rodando
# 2. Verificar se porta 3000 está disponível
# 3. Verificar firewall
```

### "MongoDB connection failed"
```bash
# Verificar se MongoDB está rodando
# Terminal 1: mongod (ou docker)
# Terminal 2: npm run dev
```

### "No módulos encontrados"
```bash
# Deletar node_modules e reinstalar
rm -rf backend/node_modules
cd backend
npm install
npm run dev
```

### Câmera não funciona
- Use dispositivo real (não emulador)
- Permita acesso à câmera nas configurações
- Reinicie o app

### Localização não funciona
- Ative GPS no dispositivo
- Saia de ambientes internos
- Aguarde 30 segundos para capturar sinal

## 🔒 Segurança em Casa

### Nunca Fazer
❌ Usar `*` em CORS em produção
❌ Deixar JWT_SECRET igual ao exemplo
❌ Expor banco de dados
❌ Deixar console.log em produção

### Fazer Sempre
✅ Mudar JWT_SECRET
✅ Usar HTTPS em produção
✅ Limitar CORS a domínios específicos
✅ Usar variáveis de ambiente

## 📊 Estrutura de Pastas

```
app-ponto/
├── frontend (raiz)        # App React Native
│   ├── src/
│   ├── App.js
│   ├── package.json
│   └── ...
├── backend/               # Servidor Node.js
│   ├── src/
│   ├── package.json
│   └── ...
├── BACKEND_INTEGRATION.md
└── README.md
```

## 🎯 Fluxo de Testes

```
Iniciar Backend (Terminal 1)
       ↓
Iniciar Frontend (Terminal 2)
       ↓
Abrir Expo Go no Celular
       ↓
Registrar Novo Usuário
       ↓
Fazer Login
       ↓
Bater Ponto
       ↓
Verificar Histórico
       ↓
Conferir Logs no Backend
```

## 🚀 Deploy Local em Rede

Se quiser testar com outro dispositivo:

```bash
# No seu PC
# 1. Discover seu IP
ipconfig
# IPv4 Address: 192.168.1.100

# 2. Compartilhar na rede
REACT_APP_API_URL=http://192.168.1.100:3000/api npm start

# 3. No outro dispositivo
# Escanear o mesmo QR code
```

## 📱 Testar com Múltiplos Usuários

1. Registrar usuário A
2. Registrar usuário B
3. Logout do app (clique em "Sair")
4. Login com outro email
5. Cada usuário tem seu histórico

## 💾 Backup de Dados

Para backup dos dados:

```bash
# Exportar MongoDB
mongodump --db app-ponto --out ./backup

# Restaurar MongoDB
mongorestore ./backup/app-ponto --db app-ponto
```

## 🎉 Parabéns!

Se chegou até aqui, seu app está rodando completamente em casa com:

✅ Frontend (React Native + Expo)
✅ Backend (Node.js + Express)
✅ Database (MongoDB)
✅ Autenticação (JWT)
✅ Segurança (Bcrypt + Rate Limiting)
✅ Logging (Auditoria Completa)
✅ Validação (Foto + Duplicata)

## 📞 Próximas Etapas

1. **Customizar**: Mude cores, logos, textos
2. **Expandir**: Adicione novos tipos de ponto
3. **Integrar**: Conecte com seu sistema RH
4. **Deploy**: Publique no Heroku/AWS/Azure

## 🆘 Precisa de Ajuda?

Verificar:
1. [README.md](README.md) - Visão geral
2. [BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md) - Integração
3. [backend/README.md](backend/README.md) - API completa
4. [DEVELOPMENT.md](DEVELOPMENT.md) - Desenvolvimento

---

**Divirta-se! 🎊**
