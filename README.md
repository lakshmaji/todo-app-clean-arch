# TODO API

[![API](https://github.com/lakshmaji/pt-rails-todo-api/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/lakshmaji/pt-rails-todo-api/actions/workflows/ci.yml)

[![UI](https://github.com/lakshmaji/pt-rails-todo-api/actions/workflows/e2e.yml/badge.svg)](https://github.com/lakshmaji/pt-rails-todo-api/actions/workflows/e2e.yml)

## Features

1. Create todo item
1. Update todo status to todo or in progress or completed
2. Dleete todo item
3. List todo items (filters, pagination)
4. User signup and login
5. Application authorization

## Client App

Docs here [Client App](./client-app/README.md)

### App screenshots

![list](./.github/assets/list.png)
![dark theme list](./.github/assets/dark.png)
![create todo](./.github/assets/add.png)
![update todo](./.github/assets/edit.png)
![delete todo](./.github/assets/delete.png)
![status filters](./.github/assets/filter.png)
![validation message](./.github/assets/validation.png)

Currently it is developed as SPA. It should SSR along with PKCE, a demo available on `feat/auth-code-pkce` git branch

### Quick setup

```bash
docker-compose up
```
Access app at http://localhost:3001/
Access API documentaion at http://localhost:3000/api-docs/index.html

## Requirements

- ruby 3.2.2
- bundler 2.4.10
- make 3.81 (optional)
- Docker 24.0.4 (optional)
- MySQL 8.3.0 (optional)

## Setup

The application can be run in your machine either using docker or manual install.

### Using docker

```bash
docker compose up
# or
make docker_dev
```

Preparing database with sample application data.

```bash
docker-compose exec -T <app service> bin/rails db:prepare
# example
docker-compose exec -T api bin/rails db:prepare
docker-compose exec -T api bin/rails db:migrate
docker-compose exec -T api bin/rails db:seed
```

### Manual 

Before proceeding further, make sure MySQL is installed. or you can use ./docker-compose.db.yml.

1. Install dependencies

    ```bash
    # project root
    bundle install
    ```
2. To configure credentials you can either use `master.key` that was shared privately or you can generate a new one for development using 

    ```bash
    bin/rails credentials:edit --environment development
    ```
3. Run migrations, database seeding

    ```bash
    bin/rails db:migrate
    bin/rails db:seed
    ```    
4. Launch the application
   
    ```bash
    bin/rails s
    ```

### Using make

*Docker must be installed

```bash
bundle install
make setup_db
make serve
```

## API documentation

The API endpoint information (Swagger OpenAPI spec) can be access at `http://localhost:3000/api-docs`. To generate API docs run

![API docs](./.github/API.png)

```bash
bin/rails rswag:specs:swaggerize 
# or
make docs
```

## Testing

The tests are written for rspec

```bash
bundle exec rspec
# or
make specs
```

## Environment variables

You can either pass env variables or use rails credentials. The env variables takes highest precedence.
   
```bash
    db:
        port: 3308
        host: 127.0.0.1
        user: root
        password: example
    allowed_cors_origins: localhost:3000
```

## First Steps

1. To consume APIs, you must sign up for an account. You can either do it from Swagger or use the below curl request
   
   ```bash
    curl -X 'POST' \
        'http://localhost:3001/v1/auth/signup' \
        -H 'accept: */*' \
        -H 'Content-Type: application/json' \
        -d '{
            "user": {
                "email": "user@example.com",
                "password": "password",
                "password_confirmation": "password",
                "first_name": "L",
                "last_name": "M"
            },
            "client_id": "webapp_id"
        }'
   ```

2. You need to authorize before making requests on `tasks` resource.

    ```bash
    # You can generate a user token locally by running below script
    ./dev/scripts/gen_token.sh
    ```

3. Copy the **access_token** from the response and pass it in `Authorization` headers for subsequent requests made on `tasks` resource.
4. When running the front end application make sure to configure allowed origins `ALLOWED_CORS_ORIGINS`.

### Directory structure

```bash
app/
├── controllers/
│   └── auth_controller.rb
├── adapters/ # adapters for REST API's
│   ├── controllers/
│   │   └── tasks_controller.rb
│   └── repositories/ # adatpers for datasources. In future if we want to use another ORM this is where we implement new adapter.
│       └── task_repository.rb
├── core/ # business logic 
│   ├── entities/
│   │   └── task.rb
│   └── use_cases/
│       └── tasks/
│           ├── create_task.rb
│           ├── ...
│           └── list_tasks.rb
├── models/ # Rails ActiveModels. Handles database related operations only.
│   └── task.rb
├── serializers/ # presentation layer
│   └── task_serializer.rb
spec/
├── requests/ # Generates Swagger compatable schema and tests API
└── models/

```

### Lint

Rubocop

```bash
bundle exec rubocop
```


## Decision registry & Assumptions

### Core principles

The application is developed based on **Hexagonal architecture**. Decouples entities from rails ORM (`ActiveRecord`). With this approach (lose coupling), we can add support for GraphQL in future easily.

#### Authentication & Authorization

The authentication for users is implemented using `devise` gem. As this is a API only application, it needs to authorize the incoming requests from client apps to confirm resource access, this was implemented using `doorkeeper` gem. 

You can create a application for your client,

```rb
Doorkeeper::Application.create(name: "MyApp", redirect_uri: "urn:ietf:wg:oauth:20:oob", scopes: ["read", "write"])
```

#### Presentation

The API responses are serialized before sending to client. This will ensure the resource structure is consistent across all applicable endpoints.

#### Business layer

The entities are responsible for validating inputs and processing the inputs. 
The use cases are self explanatory. The use cases are equivalent to services in hexagonal architecture.

#### CI pipeline

Currently the CI pipeline actions are being run using docker. But they should be configured seperately for speeding up pipeline executions.

### Assumptions

1. The authentication token is a random hex value. Currently JWT token implementations are not incorporated into the application, due to the time constraint.
2. To benefit from rails validations and to avoid re-work on validation helpers, we are using `ActiveModel::Model` in entities, due to the time constraint. Which is not correct in terms of current architecture.
3. Using `Resource Owner Password Flow` grant type to authorize requests from client application. Which currently have some secuirty concerns but considering the application scope it really doesnt matter. **PKCE** `was not implemented due to time constraint`. And also maintaining UI consistency across auth server and client application is bit time consuming task.
4. The test cases are covered for `use cases` and `requests`.
5. The swagger spec is not commited to source code. The idea is to auto generate it using github actions.
6. Introducing `elasticsearch` and `redis` is an overkill for the current application requirements. Hence not implemented.
7. Logging was not implement due to time constraint
8. Rate limiting was not implemented
9. Currently passwords are commited in codebase, most of them are for testing purpose. They can read from `.env` later.



