# Orders microservice

## Dev
1. Clonar el repositorio
2. Instalar dependencias
3. Crear archivo `.env` nasado en `.env.template`
4. Levantar servidor de nats
```
$ docker run -d --name nats-main -p 4222:4222 -p 6222:6222 -p 8222:8222 nats
```
5. Ejecutar migración de prisma `npx prisma migrate dev`
6. Levantar proyecto `yarn start:dev`