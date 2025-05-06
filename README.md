# Back-end Challenge

Desafio de back-end com Nest.js, TypeORM, GraphQL e PostgreSQL.

## Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Yarn](https://classic.yarnpkg.com/) (versão 1.22 ou superior)
- [Docker](https://www.docker.com/)

### Docker containers

```bash
docker compose up -d
```

### Microsserviço de correções

```bash
cd packages/corrections

# Instale as dependências
yarn install

# Inicie o serviço
yarn start
```

### Aplicação

```bash
cd server

# Crie o arquivo .env com as variáveis de ambiente
cp .env.example .env

# Instale as dependências
yarn install

# Inicie a aplicação
yarn start
```

#### Testes

```bash
# unit tests
yarn test

# e2e tests
yarn test:e2e

# test coverage
yarn test:cov
```

## GraphQL

Acesse o GraphiQL Playground em [http://localhost:3000/graphql](http://localhost:3000/graphql).

### Schema

```graphql
type Query {
  challenges(description: String, page: Int, perPage: Int = 10, title: String): PaginatedChallenge!

  submissions(
    challengeTitle: String
    dateRange: DateRangeArgs
    page: Int
    perPage: Int = 10
    status: SubmissionStatus
  ): PaginatedSubmissions!
}

type Mutation {
  createChallenge(description: String!, title: String!): Challenge!
  deleteChallenge(id: String!): Challenge!
  updateChallenge(description: String, id: String!, title: String): Challenge!

  submitChallenge(challengeId: String!, repositoryUrl: String!): Submission!
}
```

## Decisões

### Nomenclatura: Submissions vs Answers

Na descrição do desafio foi utilizado o nome "Submissões" para se referir às submissões dos desafios, mas no SDL de exemplo, o nome da entidade estava "Answers" (exemplo "query answers()" e "mutation answerChallenge()"). Como a modelagem do SDL era subjetiva, optei por usar o nome "Submissions".

### Relação entre as tabelas

Durante o desenvolvimento do desafio, surgiu a dúvida de como deveria ser o filtro das Submissões dos Desafios ("Filtro pelo ID do Desafio? Ou pelo título?").
A resposta que recebi por e-mail foi "que pode ser pelo título, mas você pode pensar na forma que achar que fica melhor o filtro", então optei por relacionar as tabelas para poder pesquisar as Submissões por título do desafio.
Caso o filtro fosse pelo ID do desafio, eu teria mantido as tabelas **separadas**.

### Scalar customizado: UUID

Pela descrição de modelagem das entidades não vi necessidade de criar um Scalar customizado já que todos os tipos existem no GraphQL, mas como era um requisito do desafio, optei por seguir com a documentação do Nest.js e criar um Scalar do tipo UUID, para validar os campos ID.

### Testes E2E

Como os testes E2E que eu escrevi não esperam pela resposta do Kafka para rodar, o Jest finaliza o teste enquanto o Kafka ainda está executando (mais especificamente, enviando a resposta pelo `reply`).
Isso gera alguns erros como comentado aqui https://github.com/tulios/kafkajs/issues/779#issuecomment-648900173.
Como alternativa, adicionei um `timeout` para dar tempo do Kafka responder antes do Jest finalizar o teste, mas gostaria de saber quais outras alternativas existem para resolver esse problema.

### TypeORM

Optei por utilizar o TypeORM porque tem bastante documentação sobre a ferramenta no site do Nest.js.

---

<p align="center">
  Feito com 💜 por <a href="https://github.com/jvzaniolo">João Vitor</a>.
</p>
