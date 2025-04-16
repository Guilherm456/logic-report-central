# Report Central - Sistema de Gerenciamento de Laudos Médicos

Sistema para gestão de usuários, médicos e laudos médicos com autenticação segura e interface moderna.

## 🚀 Funcionalidades Principais

- **Autenticação Segura**

  - Login com JWT Token
  - Validação de sessão

- **Gestão de Usuários**

  - CRUD completo de usuários

- **Gestão Médica**

  - Associação de usuários a médicos
  - Gerenciamento de templates de laudos

- **Gestão de Laudos**
  - Criação e armazenamento de laudos

## 🛠 Tecnologias Utilizadas

### Backend

- | **Tecnologia** | **Finalidade**    |
  | -------------- | ----------------- |
  | Java 21        | Lógica principal  |
  | Spring Boot 3  | Framework backend |
  | PostgreSQL     | Banco de dados    |
  | JWT            | Autenticação      |
  | Swagger        | Documentação API  |
  | Hibernate      | ORM               |

### Frontend

- Angular 19
- PrimeNG (UI Components)
- Tailwind CSS
- Axios (HTTP Client)

### Ferramentas

- Maven (Gerenciamento de dependências)
- npm (Pacotes frontend)
- Spring Data JPA (ORM)
- Docker (Containerização)

## ⚙️ Instalação

1. **Pré-requisitos**

```bash
- Java 17 JDK
- Node.js 18+
- Docker (ou PostgreSQL local)
```

2. **Configuração Backend**

```bash
cd api/
docker-compose up -d # Inicia o PostgreSQL, se necessário
mvn clean install
```

3. **Configuração Frontend**

```bash
cd front/
npm install
```

## 🖥 Como Executar

**Backend (Porta 8085):**

```bash
mvn spring-boot:run
```

**Frontend (Porta 4200):**

```bash
npm run start
```

Acesse a aplicação em: `http://localhost:4200`

## 📚 Documentação da API

Acesse a documentação interativa após iniciar o backend:

```http
http://localhost:8085/swagger-ui.html
```
