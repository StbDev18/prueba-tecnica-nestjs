<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Nest JS Tasks

Prueba técnica de [Nest JS](https://github.com/nestjs/nest).

## 1. Clonar proyecto

```bash
$ git clone https://github.com/StbDev18/app-nest.git
```

## 2. Instalar dependencias

```bash
$ npm install
```

## 3. Configurar variables de entorno

- Clonar el archivo ```.env.template``` y renombrar a ```.env```
- Cambiar las variables de entorno

## 4. Imagen Docker

Levantar base de datos (Doker):
```bash
$ docker-compose up -d
```

## 5. Compilar y ejecutar el proyecto

```bash
# development
$ npm run start

or

# watch mode
$ npm run start:dev

```

## Documentación

- [Postman Endpoints](https://documenter.getpostman.com/view/14890988/2sAYBXBqea)

### Librerias

1. ```@nestjs/typeorm``` y ```typeorm```

    ```bash
    $ npm install --save @nestjs/typeorm typeorm
    ```

2. ```passport-jwt``` y sus tipos de typescrypt ```@nestjs/jwt```

    ```bash
    $ npm install --save @nestjs/jwt passport-jwt
    ```

3. ```bcrypt```

    ```bash
    $ npm i bcrypt --save
    ```

4. ```class-validator``` y ```class-transformer```

    ```bash
    $ npm i class-validator class-transformer
    ```
5. ```class-validator``` y ```class-transformer```

    ```bash
    $ npm i class-validator class-transformer
    ```

6. ```@nestjs/config```

    ```bash
    $ npm i @nestjs/config
    ```

7. ```passport``` y sus tipos de typescrypt ```@nestjs/passport```

    ```bash
    $ npm install --save @nestjs/passport passport
    ```
8. ```pg```

    ```bash
    $ npm install pg --save 
    ```

9. ```@nestjs/swagger``` (Documentación)

    ```bash
    $ npm install --save @nestjs/swagger

    ```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
