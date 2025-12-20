# Melhorias de Segurança - Dashboard Admin

## Resumo das Mudanças

Foram implementadas melhorias significativas de segurança na área de acesso administrativo do Parish Connect:

### 🔐 Backend

#### 1. **Autenticação JWT**
- Implementado sistema de autenticação JWT (JSON Web Tokens)
- Tokens com expiração de 24 horas
- Arquivo: `server/middleware/auth.ts`

#### 2. **Banco de Dados de Admins**
- Nova tabela `admins` com campos:
  - `id`: Identificador único
  - `email`: Email único para login
  - `password_hash`: Senha criptografada com bcrypt (10 rounds)
  - `name`: Nome do administrador
  - `status`: Status ativo/inativo
  - `last_login`: Último acesso registrado
  - `created_at/updated_at`: Timestamps

#### 3. **Rate Limiting**
- Limite de 5 tentativas de login em 15 minutos
- Responde com HTTP 429 quando limite excedido
- Arquivo: `server/middleware/rate-limit.ts`

#### 4. **Proteção de Rotas**
- Todas as rotas de alteração (POST, PUT, DELETE) requerem autenticação JWT
- Middleware `authMiddleware` valida token em cada requisição
- Rotas protegidas:
  - POST/PUT/DELETE `/api/noticias`
  - POST/PUT/DELETE `/api/missas`
  - POST/PUT/DELETE `/api/pastorais`
  - POST/PUT/DELETE `/api/capelas`

#### 5. **Headers de Segurança**
- X-Frame-Options: DENY (previne clickjacking)
- X-Content-Type-Options: nosniff (previne MIME sniffing)
- X-XSS-Protection: ativo
- Content-Security-Policy configurado
- CORS headers apropriados

#### 6. **API de Autenticação**
```
POST /api/auth/login
  Body: { email, password }
  Response: { success, token, admin }

POST /api/auth/verify
  Headers: Authorization: Bearer {token}
  Response: { valid }

POST /api/auth/logout
  Response: { success, message }
```

### 🎨 Frontend

#### 1. **SecureStorage Utility**
- Arquivo: `client/src/lib/secure-storage.ts`
- Usa `sessionStorage` em vez de `localStorage`
- SessionStorage é limpo ao fechar a aba (mais seguro)
- Funções disponíveis:
  ```typescript
  SecureStorage.setToken(token)
  SecureStorage.getToken()
  SecureStorage.hasValidToken()
  SecureStorage.isTokenValid(token)
  SecureStorage.removeToken()
  SecureStorage.setUser(user)
  SecureStorage.getUser()
  SecureStorage.clearAll()
  ```

#### 2. **Validação de Token**
- Valida estrutura JWT (3 partes separadas por pontos)
- Verifica expiração do token
- Detecta tokens próximos de expirar

#### 3. **AdminLogin Melhorado**
- Arquivo: `client/src/pages/AdminLogin.tsx`
- Mudança de username para email
- Integração com autenticação JWT
- Rate limiting no frontend (mostra tentativas restantes)
- Bloqueio de UI após 5 tentativas
- Melhor feedback ao usuário

#### 4. **ProtectedRoute Atualizado**
- Valida token JWT antes de renderizar rota
- Limpa dados se token for inválido
- Redireciona para login se não autenticado

#### 5. **useAdminAuth Hook Melhorado**
- Integração com SecureStorage
- Suporta logout seguro
- Recupera dados do usuário autenticado
- Métodos auxiliares para requisições autenticadas

#### 6. **AuthenticatedFetch Utility**
- Arquivo: `client/src/lib/authenticated-fetch.ts`
- Funções para requisições autenticadas:
  ```typescript
  authenticatedFetch(url, options)
  authenticatedPost(url, data, options)
  authenticatedPut(url, data, options)
  authenticatedDelete(url, options)
  authenticatedFetchFormData(url, formData, method)
  ```

### 📝 Scripts Utilitários

#### Seed de Admins
- Arquivo: `script/seed-admins.ts`
- Cria admin padrão na primeira inicialização
- Email: `admin@paroquia.com`
- Senha: `senha123456` (ALTERAR EM PRODUÇÃO!)

## Configuração

### Variáveis de Ambiente

```env
# Backend
JWT_SECRET=sua-chave-secreta-super-longa
NODE_ENV=production
CORS_ORIGIN=https://seu-dominio.com

# Database
DATABASE_URL=file:./parish.db
```

### Instalação de Dependências

```bash
npm install jsonwebtoken bcrypt
npm install --save-dev @types/jsonwebtoken
```

## Como Usar

### 1. Primeira Inicialização
```bash
npm run build
npm start
```
O sistema criará automaticamente um admin padrão com:
- Email: `admin@paroquia.com`
- Senha: `senha123456`

### 2. Fazer Login
```typescript
// Frontend
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "admin@paroquia.com",
    password: "senha123456"
  })
});

const { token, admin } = await response.json();
```

### 3. Fazer Requisições Autenticadas
```typescript
import { authenticatedPost, authenticatedFetch } from "@/lib/authenticated-fetch";

// Opção 1: Usar helper functions
const response = await authenticatedPost("/api/noticias", {
  title: "Nova notícia",
  content: "Conteúdo..."
});

// Opção 2: Usar função genérica
const response = await authenticatedFetch("/api/pastorais", {
  method: "PUT",
  body: JSON.stringify({ name: "Nova pastoral" })
});

// Opção 3: Com upload de arquivo
const formData = new FormData();
formData.append("image", file);
formData.append("name", "Nome");

const response = await authenticatedFetchFormData(
  "/api/capelas",
  formData,
  "POST"
);
```

## Recomendações de Segurança

### 🔴 Crítico - Fazer em Produção

1. **Alterar senha do admin padrão imediatamente**
2. **Definir JWT_SECRET forte** (gerar com: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
3. **Usar HTTPS/TLS** em produção
4. **Configurar CORS corretamente** para domínios específicos
5. **Implementar HTTPS-only cookies** se usar cookies em vez de sessionStorage

### 🟡 Importante

1. **Implementar refresh tokens**:
   - Token de acesso com expiração curta (15 min)
   - Refresh token com expiração longa (7 dias)
   - Armazenar refresh token em httpOnly cookie

2. **Adicionar 2FA (Autenticação de Dois Fatores)**:
   - Via email ou SMS
   - Usar bibliotecas como `speakeasy` ou `@otplib/core`

3. **Logging e Monitoramento**:
   - Registrar tentativas de login falhadas
   - Monitorar acessos não autorizados
   - Auditar mudanças de dados

4. **Backup Regular** do banco de dados

### 🟢 Nice-to-have

1. Implementar **Session Management**:
   - Permitir revogar sessões
   - Limite de sessões simultâneas
   - Detectar logins simultâneos suspeitos

2. **API Rate Limiting Global**:
   - Além do rate limiting de login
   - Proteção contra brute force geral

3. **Web Application Firewall (WAF)**

## Troubleshooting

### "Token inválido ou expirado"
- Fazer login novamente
- Verificar se JWT_SECRET está configurado
- Verificar timezone do servidor

### "Muitas tentativas de login"
- Esperar 15 minutos
- Verificar IP no backend

### Erro ao criar admin
- Verificar se a tabela foi criada
- Confirmar permissões do banco de dados
- Ver logs do servidor

## Próximos Passos

1. [ ] Implementar refresh tokens com httpOnly cookies
2. [ ] Adicionar 2FA via email
3. [ ] Sistema de papéis e permissões (roles)
4. [ ] Auditoria de mudanças
5. [ ] Backup automático do banco
6. [ ] Dashboard de segurança para admin

---

**Última atualização**: 20 de dezembro de 2025
