# FlowPay

Sistema de gerenciamento de solicitações de atendimento com distribuição automática em filas por equipe e relatórios de métricas.

## 🏗️ Arquitetura

O projeto é composto por duas aplicações:

- **api**: Backend em Spring Boot (Java 21)
- **app**: Frontend em React com Vite

## 🛠️ Tecnologias

### Backend (api)
- **Java 21**
- **Spring Boot 4.1.0**
- **Spring Data JPA** - Persistência de dados
- **Spring Validation** - Validação de requisições
- **Spring Actuator** - Monitoramento e métricas
- **MySQL** - Banco de dados
- **Lombok** - Redução de código boilerplate
- **Testcontainers** - Testes com containers Docker
- **Jacoco** - Cobertura de código
- **SonarQube** - Análise de qualidade de código
- **spring-dotenv** - Gerenciamento de variáveis de ambiente

### Frontend (app)
- **React 19.2.8**
- **Vite 8.2.0** - Build tool e dev server
- **React Router DOM 7.18.2** - Roteamento
- **TailwindCSS 4.3.3** - Estilização
- **clsx** - Utilitário para classes condicionais
- **Axios 1.19.0** - Cliente HTTP
- **Recharts 3.10.1** - Gráficos e visualizações
- **Lucide React 1.31.0** - Ícones
- **React Toastify 11.1.0** - Notificações
- **Sentry React 10.70.0** - Monitoramento de erros
- **Vitest 4.1.10** - Testes com @vitest/coverage-v8
- **ESLint** - Linting
- **useSmartPolling** - Hook customizado para polling inteligente com Page Visibility API

## 📋 Pré-requisitos

- **Java 21** ou superior
- **Maven 3.8+**
- **Node.js 18+** e **npm**
- **MySQL 8+** (ou use Docker)
- **Docker** (para testes com Testcontainers)

## 🚀 Como Rodar

### Backend (api)

1. **Configure o banco de dados local**:
   
   **Opção A: Usar scripts SQL disponíveis**
   
   A pasta `api/data/` contém scripts SQL para configurar o banco de dados localmente:
   - `schema.sql` - Criação das tabelas (equipe, fila, atendente, solicitacao)
   - `insert.sql` - Dados iniciais (3 equipes, 3 filas, 9 atendentes)
   - `select.sql` - Queries para verificar os dados
   - Arquivos adicionais com dados históricos por mês
   
   Execute os scripts no seu MySQL local:
   ```bash
   mysql -u seu_usuario -p < api/data/schema.sql
   mysql -u seu_usuario -p < api/data/insert.sql
   ```
   
   **Opção B: Usar Docker**
   
   Ou use Docker para criar o banco de dados:
   ```bash
   docker run --name flowpay-db -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=flowpay -p 3306:3306 -d mysql:8
   ```

2. **Configure as variáveis de ambiente**:
   Crie um arquivo `.env` na pasta `api/` com as seguintes variáveis:
   ```env
   SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/flowpay
   DB_USER_LOCAL=seu_usuario
   DB_PASSWORD_LOCAL=sua_senha
   URL_ORIGINS=http://localhost:5173
   ```

3. **Compile e execute**:
   ```bash
   cd api
   mvn clean install
   mvn spring-boot:run
   ```

   A API estará disponível em `http://localhost:8080`

4. **Executar testes**:
   ```bash
   mvn test
   ```

5. **Gerar relatório de cobertura**:
   ```bash
   mvn test jacoco:report
   ```

### Frontend (app)

1. **Configure as variáveis de ambiente**:
   Crie um arquivo `.env` na pasta `app/` baseado no `.env.example`:
   ```env
   VITE_DSN_SENTRY="seu_dsn_sentry"
   VITE_URL_API="http://localhost:8080"
   ```

2. **Instale as dependências**:
   ```bash
   cd app
   npm install
   ```

3. **Execute em modo desenvolvimento**:
   ```bash
   npm run dev
   ```

   A aplicação estará disponível em `http://localhost:5173`

4. **Build para produção**:
   ```bash
   npm run build
   ```

5. **Executar testes**:
   ```bash
   npm run test
   ```

6. **Executar testes com cobertura**:
   ```bash
   npm run test:coverage
   ```

## 📡 Endpoints da API

### Solicitações

#### Criar Solicitação
```http
POST /solicitacao
Content-Type: application/json

{
  "referenciaConversa": 123456,
  "assunto": "problemas com cartao"
}
```

**Resposta**: `202 Accepted`
```json
{
  "id": 1,
  "referenciaConversa": 123456,
  "statusSolicitacao": "EM_FILA",
  "assunto": "problemas com cartao",
  "dataHoraInicialSolicitacao": "2024-01-15T10:30:00Z"
}
```

#### Finalizar Atendimento
```http
PUT /solicitacao/{id}/finalizar
```

**Resposta**: `200 OK`

### Relatórios

#### Tela Home
```http
GET /relatorios/home
```

**Resposta**: `200 OK`
```json
{
  "totalTickets": 150,
  "quantidadeAtendentes": 9,
  "quantidadeEquipes": 3,
  "equipes": [
    {
      "id": 1,
      "nome": "CARTAO",
      "quantidadeTicketsEmFila": 5,
      "quantidadeAtendentes": 3,
      "mediaTempoEsperaEmSegundos": 120
    }
  ]
}
```

#### Detalhes por Categoria
```http
GET /relatorios/detalhe/{categoriaEquipe}
```

**Parâmetros**: `categoriaEquipe` - CARTAO, EMPRESTIMOS, ou OUTROS_ASSUNTOS

**Resposta**: `200 OK`
```json
{
  "quantidadeAtendentes": 3,
  "tempoMedioAtendimento": 300,
  "quantidadeAtendimentosConcluidos": 50,
  "tempoMedioEspera": 120,
  "quantidadeAtendimentosEmAndamento": 5,
  "quantidadeAtendimentosCancelados": 2,
  "dataHoraUltimoCancelamento": "2024-01-15T14:30:00Z",
  "capacidadeFila": 10,
  "fila": [
    {
      "assunto": "problemas com cartao",
      "protocolo": 123456,
      "dataHoraEntrouNaFila": "2024-01-15T10:30:00Z"
    }
  ],
  "atendentes": [
    {
      "nome": "Atendente I",
      "tempoMedioAtendimento": 300,
      "quantidadeAtendimentosConcluidos": 20,
      "solicitacoes": []
    }
  ]
}
```

#### Meses com Métricas
```http
GET /relatorios/meses-metricas
```

**Resposta**: `200 OK`
```json
[
  "2024-01-01",
  "2024-02-01",
  "2024-03-01"
]
```

#### Métricas Gerais por Data
```http
GET /relatorios/metricas-gerais?data=2024-01-01
```

**Parâmetros**: `data` - Data no formato ISO (YYYY-MM-DD)

**Resposta**: `200 OK`
```json
{
  "tempoMedioAtendimento": 300,
  "tempoMedioEspera": 120,
  "totalAtendimentos": 150,
  "totalTicketsRecusados": 10,
  "mediaTicketsRecusadosPorDia": 2,
  "taxaRecusa": 0.067,
  "equipe": [
    {
      "nome": "CARTAO",
      "tempoMedioAtendimento": 300,
      "tempoMedioEspera": 120,
      "totalAtendimentos": 50,
      "totalTicketsRecusados": 3,
      "mediaTicketsRecusadosPorDia": 1
    }
  ]
}
```

## 🗃️ Estrutura do Banco de Dados

### Entidades

#### Solicitação
- `id`: Identificador único
- `referenciaConversa`: Referência única da conversa (natural ID)
- `statusSolicitacao`: SOLICITADO, EM_FILA, EM_ATENDIMENTO, FINALIZADO, RECUSADO_POR_FILA_ESPERA_CHEIA
- `assunto`: Assunto da solicitação
- `dataHoraInicialSolicitacao`: Timestamp de criação
- `dataHoraInicialFila`: Timestamp de entrada na fila
- `dataHoraInicialAtendimento`: Timestamp de início do atendimento
- `dataHoraFinalAtendimento`: Timestamp de finalização
- `fila`: Relacionamento com Fila
- `atendente`: Relacionamento com Atendente

#### Atendente
- `id`: Identificador único
- `nomeDeUsuario`: Nome do atendente
- `isCheio`: Indica se está com capacidade máxima
- `equipe`: Relacionamento com Equipe
- `solicitacoes`: Lista de solicitações atendidas

#### Equipe
- `id`: Identificador único
- `categoria`: CARTAO, EMPRESTIMOS, OUTROS_ASSUNTOS
- `fila`: Relacionamento com Fila
- `atendentes`: Lista de atendentes da equipe

#### Fila
- `id`: Identificador uniqueness
- `capacidadeMaxima`: Capacidade máxima da fila
- `equipe`: Relacionamento com Equipe

### Categorias de Assunto

- **CARTAO**: "problemas com cartao"
- **EMPRESTIMO**: "contratacao de emprestimo"
- **OUTROS_ASSUNTOS**: "outros assuntos"

## 🔄 Fluxo de Atendimento

1. **Criação da Solicitação**: Cliente cria uma solicitação com referência de conversa e assunto
2. **Classificação**: O sistema classifica automaticamente a categoria baseada no assunto
3. **Distribuição em Fila**: A solicitação é colocada na fila da equipe correspondente
4. **Atribuição ao Atendente**: Quando há atendente disponível, a solicicação é atribuída
5. **Atendimento**: Atendente realiza o atendimento
6. **Finalização**: Atendimento é finalizado e métricas são calculadas

## 🧪 Testes

### Backend
- Testes de unidade com JUnit 5
- Testes de integração com Testcontainers (MySQL)
- Cobertura de código com Jacoco
- Exclusões de cobertura: domain, config, controller, exception

### Frontend
- Testes de componentes com Vitest e Testing Library
- Cobertura de código com @vitest/coverage-v8
- Meta de 100% de cobertura de código
- Testes E2E podem ser adicionados

## 📊 Métricas e Monitoramento

### Actuator Endpoints
- `GET /actuator/health` - Health check
- `GET /actuator/metrics` - Métricas da aplicação

### SonarCloud & CI/CD

**Backend (api)**
- Análise de qualidade com SonarCloud via Maven
- Cobertura de código via Jacoco
- Exclusões específicas para domain, config, controller, exception
- Pipeline GitHub Actions: `.github/workflows/maven-api.yml`
- Deploy automático no Google Cloud Run (Cloud SQL + Artifact Registry)

**Frontend (app)**
- Análise de qualidade com SonarCloud via GitHub Actions
- Cobertura de código via Vitest (LCOV)
- Exclusões específicas: main.jsx, App.jsx, router, constants, api/base
- Pipeline GitHub Actions: `.github/workflows/maven-app.yml`
- Deploy automático no Firebase Hosting

### Sentry
Monitoramento de erros no frontend com Sentry React

## 🔧 Configuração

### CORS
Configurado para permitir origens específicas via variável `URL_ORIGINS`

### Pool de Conexões
- Maximum Pool Size: 3
- Minimum Idle: 0
- Idle Timeout: 10000ms
- Max Lifetime: 1800000ms
- Connection Timeout: 20000ms

### Logging
- Pattern de console configurado
- SQL debug habilitado para Hibernate
- Spring Web Servlet debug habilitado

## 📁 Estrutura do Projeto

```
Desafio-I---FlowPay/
├── api/                          # Backend Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── br/com/ubots/flowpay/
│   │   │   │       ├── config/          # Configurações (CORS, Exception Handler)
│   │   │   │       ├── controller/      # REST Controllers
│   │   │   │       ├── domain/          # Entidades JPA e Enums
│   │   │   │       ├── repository/      # Repositórios JPA
│   │   │   │       ├── service/         # Lógica de negócio
│   │   │   │       ├── validator/       # Validadores customizados
│   │   │   │       └── FlowpayApplication.java
│   │   │   └── resources/
│   │   │       └── application.yml      # Configuração Spring
│   │   └── test/                        # Testes
│   └── pom.xml                         # Dependências Maven
└── app/                          # Frontend React
    ├── public/                       # Arquivos estáticos
    ├── src/                         # Código fonte React
    │   ├── components/              # Componentes React
    │   ├── pages/                   # Páginas da aplicação
    │   ├── services/                # Serviços API
    │   └── main.jsx                 # Entry point
    ├── .env.example                 # Exemplo de variáveis de ambiente
    ├── package.json                 # Dependências npm
    └── vite.config.js              # Configuração Vite
```

## 🚦 Status da Solicitação

Os seguintes status são possíveis para uma solicitação:

- **SOLICITADO**: Solicitação criada e aguardando processamento
- **EM_FILA**: Solicitação na fila de espera
- **EM_ATENDIMENTO**: Solicitação sendo atendida por um atendente
- **FINALIZADO**: Atendimento concluído com sucesso
- **RECUSADO_POR_FILA_ESPERA_CHEIA**: Solicitação recusada por falta de capacidade na fila

## 🔐 Segurança

- Validação de entrada com Jakarta Validation
- Controle de concorrência com JPA `@Version`
- Natural ID para referência de conversa única
- CORS configurado para origens específicas

## 📝 Notas Adicionais

### Backend
- O sistema usa otimista locking com `@Version` para controle de concorrência
- A classificação de assunto é automática baseada em texto
- Cada equipe tem sua própria fila com capacidade máxima
- Atendentes têm limite de atendimentos simultâneos
- O sistema calcula métricas de tempo de espera e atendimento

### Frontend
- **Smart Polling Inteligente**: Hook customizado `useSmartPolling` para atualização em tempo real das filas com pausa automática quando a aba está em segundo plano (Page Visibility API)
- Utiliza clsx para gerenciamento de classes condicionais
- Monitoramento de erros em produção com Sentry
- Arquitetura de componentes reutilizáveis com testes unitários
- Roteamento declarativo com React Router DOM

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é parte do Desafio I da Ubots.
