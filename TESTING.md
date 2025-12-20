## 🧪 Guia de Teste - Sistema de Segurança

### 📋 Pré-requisitos

- Node.js instalado
- Dependências instaladas: `npm install`
- Servidor rodando: `npm start`
- Navegador (Chrome, Firefox, Safari, Edge)

---

### ✅ Testes do Backend

#### 1. Teste de Login

**Endpoint:** `POST /api/auth/login`

```bash
# Teste 1: Login com credenciais corretas
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@paroquia.com",
    "password": "senha123456"
  }'

# Esperado: 200 OK com token JWT
```

```bash
# Teste 2: Login com credenciais incorretas
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@paroquia.com",
    "password": "senhaerrada"
  }'

# Esperado: 401 Unauthorized
```

#### 2. Teste de Rate Limiting

```bash
# Fazer 6 requisições de login rapidamente
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@paroquia.com","password":"errada"}'
done

# Esperado: A 6ª requisição retorna 429 Too Many Requests
```

#### 3. Teste de Rota Protegida sem Token

```bash
# Tentar criar notícia sem autenticação
curl -X POST http://localhost:3000/api/noticias \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Teste",
    "content": "Conteúdo"
  }'

# Esperado: 401 Unauthorized
```

#### 4. Teste de Rota Protegida com Token

```bash
# Passo 1: Fazer login para obter token
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@paroquia.com","password":"senha123456"}' \
  | jq -r '.token')

# Passo 2: Usar token para criar notícia
curl -X POST http://localhost:3000/api/noticias \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Notícia de Teste",
    "excerpt": "Teste de segurança",
    "content": "Conteúdo de teste",
    "status": "published"
  }'

# Esperado: 201 Created com dados da notícia
```

#### 5. Teste de Token Inválido

```bash
# Usar token inválido
curl -X POST http://localhost:3000/api/noticias \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token_invalido" \
  -d '{"title":"Teste"}'

# Esperado: 401 Unauthorized
```

---

### ✅ Testes do Frontend

#### 1. Teste de Login via UI

1. Abrir `http://localhost:3000/admin`
2. Preencher formulário com:
   - Email: `admin@paroquia.com`
   - Senha: `senha123456`
3. Clicar "Entrar"
4. Verificar se redirecionou para `/admin/dashboard`
5. Verificar se mensagem de sucesso aparece

#### 2. Teste de Rate Limiting no Frontend

1. Abrir `http://localhost:3000/admin`
2. Preencher com email correto e senha errada
3. Clicar "Entrar" 5 vezes rapidamente
4. Verificar se:
   - Contagem de tentativas aparece
   - Campo fica desabilitado após 5 tentativas
   - Mensagem de bloqueio aparece

#### 3. Teste de Armazenamento Seguro

Abrir DevTools (F12) e executar:

```javascript
// Verificar se sessionStorage está sendo usado
console.log(sessionStorage.getItem("app_token"));

// Verificar se localStorage está vazio (não deve ter token)
console.log(localStorage.getItem("adminToken")); // Deve ser null

// Após logout, sessão deve ser limpa
console.log(sessionStorage.getItem("app_token")); // Deve ser null
```

#### 4. Teste de Validação de Token

Executar no console após login:

```javascript
// Verificar token armazenado
import { SecureStorage } from "./lib/secure-storage";

const token = SecureStorage.getToken();
console.log("Token válido:", SecureStorage.isTokenValid(token));

// Verificar payload
const payload = SecureStorage.getTokenPayload(token);
console.log("Payload:", payload);

// Verificar expiração
const expirando = SecureStorage.isTokenExpiringSoon(token);
console.log("Token expirando em 5 min?:", expirando);
```

#### 5. Teste de ProtectedRoute

1. Fazer login normalmente
2. Navegar para `/admin/dashboard` - deve funcionar
3. Abrir DevTools e executar:
   ```javascript
   sessionStorage.removeItem("app_token");
   ```
4. Atualizar a página
5. Verificar se foi redirecionado para `/admin`

#### 6. Teste de Requisições Autenticadas

Abrir DevTools e executar:

```javascript
import { authenticatedPost } from "./lib/authenticated-fetch";

// Teste criar notícia autenticado
const res = await authenticatedPost("/api/noticias", {
  title: "Teste",
  excerpt: "Teste",
  content: "Conteúdo de teste",
  status: "published"
});

const data = await res.json();
console.log("Resposta:", data);
```

---

### 🔒 Testes de Segurança

#### 1. Teste XSS

```javascript
// No console do navegador
const payload = '"><script>alert("XSS")</script>';
// Tentar enviar via formulário
// Não deve executar o script (verificar no console)
```

#### 2. Teste CSRF

```bash
# Verificar headers CORS
curl -i -X OPTIONS http://localhost:3000/api/noticias

# Verificar se responde com headers apropriados
```

#### 3. Teste de Headers de Segurança

```bash
curl -i http://localhost:3000/

# Verificar presença de:
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# X-XSS-Protection: 1; mode=block
# Content-Security-Policy: ...
```

---

### 📊 Checklist de Testes

- [ ] Login com credenciais corretas
- [ ] Login com credenciais incorretas
- [ ] Rate limiting após 5 tentativas
- [ ] Rotas públicas acessíveis (GET)
- [ ] Rotas protegidas bloqueadas sem token
- [ ] Rotas protegidas funcionam com token válido
- [ ] Token inválido retorna 401
- [ ] SessionStorage usar (não localStorage)
- [ ] Headers de segurança presentes
- [ ] CORS configurado corretamente
- [ ] ProtectedRoute redireciona sem token
- [ ] Logout limpa dados
- [ ] Dashboard exibe nome do admin
- [ ] Requisições autenticadas funcionam
- [ ] Token com expiração é rejeitado

---

### 🐛 Debugging

#### Ativar Logs Detalhados

Backend (server/index.ts):
```typescript
console.log("🔐 Verificando autenticação...");
console.log("Token recebido:", token);
console.log("Token válido:", verifyToken(token));
```

Frontend (console):
```javascript
// Adicionar logs de autenticação
localStorage.setItem("DEBUG_AUTH", "true");

// Monitorar requisições autenticadas
window.fetch = (function(originalFetch) {
  return function(...args) {
    console.log("Fetch:", args[0], args[1]);
    return originalFetch.apply(this, args);
  };
})(window.fetch);
```

#### Verificar Network

1. Abrir DevTools > Network
2. Fazer requisição de login
3. Verificar resposta contém `token` e `admin`
4. Verificar Headers incluem `Authorization: Bearer ...`

---

### 📝 Relatório de Teste

Usar este template para documentar testes:

```markdown
## Teste: [Nome do Teste]

**Data**: [Data]
**Resultado**: ✅ PASSOU / ❌ FALHOU

**Esperado**: [O que deveria acontecer]
**Obtido**: [O que realmente aconteceu]

**Observações**: [Qualquer detalhe relevante]
```

---

**Última atualização**: 20 de dezembro de 2025
