# ToDo List

- [API Endpoints](#api-endpoints)
- [How To](#how-to)
- [Configuration](#configuration)

This is a simple MERN project.

Get the [React](https://github.com/psteh/todo-list-web) app here.

# API Endpoints

| Method | Endpoints      | Description           |
| ------ | -------------- | --------------------- |
| GET    | `/api/v1/todo` | Get list of todos     |
| POST   | `/api/v1/todo` | Create new todo       |
| PUT    | `/api/v1/todo` | Update existing todo  |
| DELETE | `/api/v1/todo` | Delete todo from list |

# How To

Install dependencies

```
# install dependencies
npm install

# run development with hot reload
npm run dev

# run without hot reload
npm run start
```

# Configuration

Content for `config.yml`

```yaml
env: development
host: localhost
port: 1234
secret: secret
timezone: 

api: 
  limit_time: 1s
  limit_max: 100

logger:
  path: ./log
  filename: log.log
  level: debug
  log_to_console: true
  write_to_File: true

# connection to MongoDB
db:
  username: 
  password: 
  name: 
```

