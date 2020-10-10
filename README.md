# Todo list 

- [API Endpoints](#api-endpoints)
- [How To](#how-to)
- [Configuration](#configuration)

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
npm install
```

Run server

```
npm run start
```

# Configuration

```yaml
env: development
host: localhost
port: 
secret: secret
timezone: Asia/Kuala_Lumpur

api: 
  limit_time: 1s
  limit_max: 100

logger:
  path: ./log
  filename: log.log
  level: debug
  log_to_console: true
  write_to_File: true

db:
  username: 
  password: 
  name: 
```

