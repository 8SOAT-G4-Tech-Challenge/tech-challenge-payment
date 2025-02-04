## Como Iniciar a Aplicação

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/)
- Docker Compose

### Passo a passo

1.  Clone o repositório:

```sh
  git clone https://github.com/8SOAT-G4-Tech-Challenge/tech-challenge-payment.git
  cd tech-challenge
```

<br>

2.  Certifique-se de que os arquivos Dockerfile e docker-compose.yml estão presentes na raiz do projeto.

<br>

3. Criar um `keyfile` (pelo Windows):
   O MongoDB exige um `keyFile` para autenticar os membros do Replica Set quando a autenticação está ativada. O Replica Set é necessário pois o Prisma exige isso para operações transacionais.

- Na raiz do projeto, executar os seguintes comandos:

```sh
  $randomKey = [System.Convert]::ToBase64String((1..756 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
  Set-Content -Path mongo-keyfile -Value $randomKey
```

Isso cria um arquivo mongo-keyfile com um conteúdo aleatório em Base64 (exigido pelo MongoDB).

- Para configurar as permissões do arquivo, executar os seguintes comandos:

```sh
  icacls mongo-keyfile /inheritance:r
  icacls mongo-keyfile /grant:r "Todos:F"
```

Isso remove permissões herdadas e concede acesso apenas ao usuário atual.

<br>

4.  Inicie a aplicação com Docker Compose:

```sh
  docker-compose up
```

<br>

5.  A aplicação será iniciada.

<br>

6. Configurar Replica Set

- Acessar o container do MongoDB:

```sh
  docker exec -it tech-challenge-payment-mongo mongosh
```

- Iniciar o Replica Set:

```sh
  rs.initiate({
    _id: "rs0",
    members: [{ _id: 0, host: "mongodb:27017" }]
  })
```

- Criar Usuário Administrador:

```sh
  use admin
```

```sh
  db.createUser({
    user: "tech-challenge",
    pwd: "docker",
    roles: [{ role: "root", db: "admin" }]
  })
```

- Autenticar

```sh
  db.auth("user", "password")
```

Após realizar estas configurações, deve ser possível realizar operações no banco através da API.

Para derrubar o serviço, execute o comando:

```sh
  docker compose down
```
