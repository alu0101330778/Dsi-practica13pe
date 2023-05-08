# [PRÁCTICA 11.](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-alu0101330778.github.io). 
## Jairo Alonso Abreu - alu0101330778.
[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-alu0101330778.github.io/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-alu0101330778.github.io?branch=main)

[![Coveralls](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-alu0101330778.github.io/actions/workflows/coveralls.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-alu0101330778.github.io/actions/workflows/coveralls.yml)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-alu0101330778.github.io&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-alu0101330778.github.io)

## Índice <a name="índice"></a>
1. [Introducción](#introducción)
2. [Funcionamiento de la aplicación](#funcionamiento)
2. [Funciones Básicas](#funcionesBasicas)
3. [Servidor](#Servidor)
  3.1. [Manejadores] (#manejadores)
5. [Conclusiones](#conclusiones)
6. [Referencias](#referencias)

## Introducción <a name="introducción"></a>
> [Volver al índice](#índice)

En está práctica se han desarrollado 3 ejercicios. 

## Funcionamiento de la aplicación <a name="funcionamiento"></a>
Tras habe descargado el repositorio y haber instalado las dependencias necesarias, se puede ejecutar el servidor con el comando `npm run start`. Hecho esto el servidor estará a la escucha hasta que mandes una peticion de apagar o cierres el proceso. Para interactuar con el se puede usar `thunderclient` y poder mandar peticiones http.
Las peticiones que se pueden hacer son con los siguientes verbos:
- GET: Se puede obtener la lista de funkos de un usuario, obtener un funko en concreto o crear un usuario.
    · `/funkos?user=nombreUsuario&action=-l`: Devuelve la lista de funkos de un usuario.
    · `/funkos?user=nombreUsuario&action=-r&id=idFunko`: Devuelve un funko en concreto.
    · `/funkos?user=nombreUsuario&action=-c`: Crea un usuario.
- POST: Se puede añadir un funko a un usuario.
    · `/funkos?user=nombreUsuario&id=0&name=Funko&description=Funko Description&type=POP&genre=MUSIC&franchise=Funko franchise&number=0&exclusive=true&specialFeatures=Funko sepacialFeatures&marketValue=0`: Añade un funko a un usuario.
- DELETE: Se puede eliminar un funko de un usuario.
    · `/funkos?user=nombreUsuario&id=idFunko`: Elimina un funko de un usuario.
- PATCH: Se puede modificar un funko de un usuario.
    · `/funkos?user=nombreUsuario&id=idFunko&name=Funko&description=Funko Description&type=POP&genre=MUSIC&franchise=Funko franchise&number=0&exclusive=true&specialFeatures=Funko sepacialFeatures&marketValue=0`: Modifica un funko de un usuario.

Hay que tener en cuenta que a la hora de introducir los datos hay que respetar el formato que está a continuación:
```ts
export type funkoSchema = {
  id: number;
  name: string;
  description: string;
  type: type;
  genre: genre;
  franchise: string;
  number: number;
  exclusive: boolean;
  specialFeatures: string;
  marketValue: number;
};
export enum genre {
  ANIMATION = "Animation",
  MOVIES_TV = "Movies & TV",
  VIDEOGAMES = "Video Games",
  SPORTS = "Sports",
  MUSIC = "Music",
  ANIME = "Anime",
  OTHER = "Other",
}
export enum type {
  POP = "Pop!",
  POP_RIDES = "Pop! Rides",
  VYNIL_SODA = "Vynil Soda",
  VYNIL_GOLD = "Vynil Gold",
  OTHER = "Other",
}

```

Un ejemplo exitoso de una respuesta de la API con la petición: GET: `/funkos?user=nombreUsuario&action=-r&id=0` sería:
```json
{
  "success": true,
  "funkoPops": [
    {
      "id": 0,
      "name": "Funko",
      "description": "Funko Description",
      "type": "POP",
      "genre": "MUSIC",
      "franchise": "Funko franchise",
      "number": 0,
      "exclusive": true,
      "specialFeatures": "Funko sepacialFeatures",
      "marketValue": 0
    }
  ]
}
```
Sin embargo si por ejemplo no se introduce un usuario (GET: `/funkos?user&action=-r&id=0`), la respuesta sería:
```json
{
  "success": false,
  "error": "Error, no se ha especificado el usuario"
}
```
Sabiendo como funciona se procede a explicar el servidor y las funciones que se han implementado.
Antes de meternos de lleno con los manejadores del servidor, se van a ver las funciones básicas que se han desarrollado para poder luego gestionar las peticiones:
## Funciones básicas <a name="funcionesBasicas"></a>
En total se han desarrollado 5 funciones básicas:
#### Comprobar si existe un usuario `comprobarUsuario()`
Esta función es la más básica de todas ya que solo comprueba si existe un usuario. Esto se realiza intentando acceder a la ruta del usuario por lo que si este no existe saltará un error. En caso de que no se haya especificado un usuario saltará otro error. Si el usuario existe no se devolverá ningún error.
```ts
export const compruebaUsuario = (
  user: string,
  cb: (err: string | undefined) => void
) => {
  fs.access(`src/funko/users/${user}/funko-list.json`, (err) => {
    if (err) {
      if (user === undefined || user === "") {
        cb("Error, no se ha especificado el usuario");
      } else {
        cb(
          "Error, el usuario " + user +" no existe, para crearlo use GET con el parametro -c"
        );
      }
    } else {
      cb(undefined);
    }
  });
};
```
#### Crea un usuario `createUser()`
Esta función se encarga de crear un usuario. Para ello se comprueba si existe el usuario y si no existe se crea. Para realizar está operación se usa `fs.mkdir()` que crea un directorio en la ruta especificada y se le añade un fichero `funko-list.json` con un array vacío.
```ts
export const createUser = (
  user: string,
  cb: (err: string | undefined) => void
) => {
  compruebaUsuario(user, (err) => {
    if (err) {
      fs.mkdir(`src/funko/users/${user}`, { recursive: true }, (err) => {
        if (err) {
          cb(`Error creating user folder: ${err.message}`);
        } else {
          fs.writeFile(
            `src/funko/users/${user}/funko-list.json`,
            "[]",
            (err) => {
              if (err) {
                cb(`Error creating user file: ${err.message}`);
              } else {
                cb(undefined);
              }
            }
          );
        }
      });
    } else {
      cb("El usuario con ese nombre ya existe, por favor elige otro");
    }
  });
};

```
Si se ha creado correctamente el usuario se devuelve undefined por la salida de err, en caso contrario se devolverá un mensaje de error.
#### Leer un fichero `readFile()`
Esta función se encarga de leer un fichero. Para ello se comprueba si existe el usuario y si existe se lee el fichero. Para realizar está operación se usa `fs.readFile()` y devuelve el contenido del fichero en formato string.
```ts
export const readFiles = (
  user: string,
  cb: (err: string | undefined, data: string | undefined) => void
) => {
  compruebaUsuario(user, (err) => {
    if (err) {
      cb(err, undefined);
    } else {
      const path = `src/funko/users/${user}/funko-list.json`;
      fs.readFile(path, (err, data) => {
        if (err) {
          cb(`Error reading notes file: ${err.message}`, undefined);
        } else {
          cb(undefined, data.toString());
        }
      });
    }
  });
};
```
Si se ha leido correctamente el fichero se devuelve undefined por la salida de err y el contenido del fichero coo string, en caso contrario se devolverá un mensaje por la salida de error y undefined poir la salida de datos.

#### Escribir un fichero `writeFile()`
Al escribir un fichero no se comprueba el usuarioya que se ha comprbado previamente al leerlo. Se usa `fs.writefile()` y en caso de que se produzca algún error se devolverá un mensaje de error, si no se ha producido ningún error se devolverá undefined.
```ts
export const writeFiles = (
  user: string,
  data: string,
  cb: (err: string | undefined) => void
) => {
  fs.writeFile(`src/funko/users/${user}/funko-list.json`, data, (err) => {
    if (err) {
      cb(`Error writing notes file: ${err.message}`);
    } else {
      cb(undefined);
    }
  });
};
```
#### Listar los funkos de un usuario `listRead()`
Esta función básica se encarga de los comandos de listar y leer un funko ya que recibe un array de funkos y un comando. Si el comando es `-l` se devolverá el array de funkos, si el comando es `-r` se devolverá el funko con el id especificado. En caso de no especificar un id o que el id no esté en la lista de funkos se devolverá un error, al igual que si no se especifica un comando válido.
```ts
export const listRead = (
  funkos: funkoSchema[],
  option: string,
  cb: (error: string | undefined, data: funkoSchema[] | undefined) => void,
  id?: number
) => {
  if (option === "-l") {
    cb(undefined, funkos);
  } else if (option === "-r") {
    if (id !== undefined && !isNaN(id) && id !== null) {
      const funkoFilter = funkos.filter((funko) => funko.id === id);
      if (funkoFilter.length > 0) {
        cb(undefined, funkoFilter);
      } else {
        cb("No se ha encontrado el funko con id " + id, undefined);
      }
    } else {
      cb("No ha especificado un id válido", undefined);
    }
  } else {
    cb("Bad command", undefined);
  }
};
```
## Servidor <a name="Servidor"></a>
El servidor `app` usa `app.use()` para acceder a los funkos y a las funciones se ha creado una ruta estatica dentro de la carpeta `/funko`
```ts
export const app = express();
const __dirname = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/funko/"
);
app.use(express.static(__dirname));
```
Ya declarada la ruta, pasamos a los manejadores de las peticiones.
### Manejadores <a name="manejadores"></a>
#### GET`
Este manejador, como se ha explicado antes, se encarga de obtener la lista de funkos de un usuario, obtener un funko en concreto o crear un usuario.
Cuando se recibe una request, se comprueba que los parametros `action` y `user` no estén vacios y que existan. A continuacion se comprueban las acciones que se pueden hacer:
- `-l`: Devuelve la lista de funkos de un usuario.
- `-r`: Devuelve un funko en concreto.
- `-c`: Crea un usuario.

Si se obtiene la opción `-c` se llama a la función `createUser`. Si se obtiene la opción `-l` o `-r` se llama a la función `readFiles` para posteriormente, si `readFiles` no devuelve un error, llamar a la función `listRead()` que devolverá una lista de funkos o un funko en concreto.
Si la lista de funkos se devuelve, el servidor envía un json con la propiedad `success` a `true` y la propiedad `funkoPops` con la lista de funkos.
```ts
app.get("/funko", (req, res) => {
  const response: ResponseType = {
    success: false,
  };
  if (typeof req.query.action !== undefined && req.query.action !== "") {
    if (typeof req.query.user !== undefined && req.query.user !== "") {
      
      if (req.query.action === "-c") {
        createUser(req.query.user as string, (err) => {
          if (err) {
            response.success = false;
            response.error = err;
            res.send(response);
          } else {
            response.success = true;
            response.error = "Usuario creado con éxito";
            res.send(response);
          }
        });
      } else {
        readFiles(req.query.user as string, (err, data) => {
          if (err) {
            response.success = false;
            response.error = err;
            res.send(response);
          } else {
            const funkolist: funkoSchema[] = JSON.parse(data as string);
            listRead(
              funkolist,
              req.query.action as string,
              (err, data) => {
                if (err) {
                  response.success = false;
                  response.error = err;
                  res.send(response);
                } else {
                  response.success = true;
                  response.funkoPops = data;
                  res.send(response);
                }
              },
              parseInt(req.query.id as string)
            );
          }
        });
      }
    } else {
      response.success = false;
      response.error = "Please, introduce a user";
      res.send(response);
    }
  } else {
    response.success = false;
    response.error = "Please, introduce a command";
    res.send(response);
  }
});
```
#### POST <a name="POST"></a>
El manejador `POST` se encarga de añadir un funko a la lista de funkos de un usuario. Primero se lee el funiko correspondiente al usuario, dentro de `readFiles()` se llama a `comprobarUsuario()` para comprobar que el usuario existe. Si el usuario existe, se lee la lista de funkos y se guarda en el array `funkolist`, se comprueba que el `id` del funko que se va a añadir no exista en la `funkolist` y que los campos no estén vacíos y se crea un esquema de funko con los datos proporcionados. Una vez comprobado, se añade el funko a la lista y se mandda la lista a `writeFiles()` que escribe la lista en el fichero correspondiente.
```ts
app.post("/funko", (req, res) => {
  const response: ResponseType = {
    success: false,
  };
  readFiles(req.query.user as string, (err, data) => {
    if (err) {
      response.success = false;
      response.error = err;
      res.send(response);
    } else {
      const funkolist: funkoSchema[] = JSON.parse(data as string);

      if (
        req.query.id === "" ||
        req.query.name === "" ||
        req.query.description === "" ||
        req.query.type === "" ||
        req.query.genre === "" ||
        req.query.franchise === "" ||
        req.query.number === "" ||
        req.query.exclusive === "" ||
        req.query.specialFeatures === "" ||
        req.query.marketValue === ""
      ) {
        response.success = false;
        response.error = "Bad request";
        res.send(response);
      } else {
        //Comprobar que el id no existe
        const funkofilter = funkolist.filter(
          (funko) => funko.id === parseInt(req.query.id as string)
        );
        if (funkofilter.length > 0) {
          response.success = false;
          response.error = "El id ya existe";
          res.send(response);
        } else {
          const funko: funkoSchema = {
            id: parseInt(req.query.id as string),
            name: req.query.name as string,
            description: req.query.description as string,
            type: req.query.type as type,
            genre: req.query.genre as genre,
            franchise: req.query.franchise as string,
            number: parseInt(req.query.number as string),
            exclusive: req.query.exclusive as unknown as boolean,
            specialFeatures: req.query.specialFeatures as string,
            marketValue: parseInt(req.query.marketValue as string),
          };

          funkolist.push(funko);
          writeFiles(
            req.query.user as string,
            JSON.stringify(funkolist),
            (err) => {
              if (err) {
                response.success = false;
                response.error = err;
                res.send(response);
              } else {
                response.success = true;
                response.funkoPops = [funko];
                res.send(response);
              }
            }
          );
        }
      }
    }
  });
});
```
Si todo ha salido bien, el servidor devolvera al cliente un archivo `.json` con el funko añadido: 
```json
{
  "success": true,
  "funkoPops": [
    {
      "id": 1,
      "name": "Funko 1",
      "description": "Funko 1",
      "type": "vinyl",
      "genre": "fantasy",
      "franchise": "Funko",
      "number": 1,
      "exclusive": true,
      "specialFeatures": "none",
      "marketValue": 100
    }
  ]
}
```
En caso contrario, devolverá un mensaje de error (añadir un funko ya existente):
```json
{
  "success": false,
  "error": "El id ya existe"
}
```
#### DELETE <a name="DELETE"></a>
El manejador `DELETE` se encarga de eliminar un funko de la lista de funkos de un usuario. Al igual que en `POST` se lee la lista de funkos correspondiente al usuario y se guarda en una `funkolist`.Se comprueba que el `id` del funko que se va a eliminar exista en la `funkolist` con `funkofilter` y que el campo `id` no esté vacío. Por último se filtra la lista de datos excluyendo el funko que se va a eliminar y se manda la lista a `writeFiles()` que escribe la lista en el fichero correspondiente.
```ts
app.delete("/funko", (req, res) => {
  const response: ResponseType = {
    success: false,
  };
  readFiles(req.query.user as string, (err, data) => {
    if (err) {
      response.success = false;
      response.error = err;
      res.send(response);
    } else {
      const funkolist: funkoSchema[] = JSON.parse(data as string);
      if (req.query.id === "" || req.query.id === undefined) {
        response.success = false;
        response.error = "Fallo en el dato id";
        res.send(response);
      } else {
        const funkofilter = funkolist.filter(
          (funko) => funko.id === parseInt(req.query.id as string)
        );
        if (funkofilter.length > 0) {
          const funkolistnew = funkolist.filter(
            (funko) => funko.id !== parseInt(req.query.id as string)
          );
          writeFiles(
            req.query.user as string,
            JSON.stringify(funkolistnew),
            (err) => {
              if (err) {
                response.success = false;
                response.error = err;
                res.send(response);
              } else {
                response.success = true;
                res.send(response);
              }
            }
          );
        } else {
          response.success = false;
          response.error =
            "No se ha encontrado el funko con id " + req.query.id;
          res.send(response);
        }
      }
    }
  });
});
```
Si todo ha salido bien, el servidor devolvera al cliente un archivo `.json` con el funko eliminado: 
```json
{
  "success": true
}
```
En caso contrario, devolverá un mensaje de error (eliminar un funko que no existe):
```json
{
  "success": false,
  "error": "No se ha encontrado el funko con id 1"
}
```
#### PATCH <a name="PATCH"></a>
El manejador `PATCH` se encarga de modificar un funko de la lista de funkos de un usuario. Al igual que en `POST` se lee la lista de funkos correspondiente al usuario y se guarda en una `funkolist`.Se comprueba que el `id` del funko que se va a modificar exista en la `funkolist` con `funkofilter` y que los campos no estén vacíos. Por último se filtra la lista de datos excluyendo el funko que ya estaba en la lista y se añade el nuevo funko modificado. Por último, se manda la lista a `writeFiles()` que escribe la lista en el fichero correspondiente.
```ts
app.patch("/funko", (req, res) => {
  const response: ResponseType = {
    success: false,
  };
  readFiles(req.query.user as string, (err, data) => {
    if (err) {
      response.success = false;
      response.error = err;
      res.send(response);
    } else {
      let funkolist: funkoSchema[] = JSON.parse(data as string);
      if (
        req.query.id === "" ||
        req.query.name === "" ||
        req.query.description === "" ||
        req.query.type === "" ||
        req.query.genre === "" ||
        req.query.franchise === "" ||
        req.query.number === "" ||
        req.query.exclusive === "" ||
        req.query.specialFeatures === "" ||
        req.query.marketValue === ""
      ) {
        response.success = false;
        response.error = "Bad request";
        res.send(response);
      } else {
        const funkofilter = funkolist.filter(
          (funko) => funko.id === parseInt(req.query.id as string)
        );
        if (funkofilter.length == 0) {
          response.success = false;
          response.error = "El id no existe";
          res.send(response);
        } else {
          const funko: funkoSchema = {
            id: parseInt(req.query.id as string),
            name: req.query.name as string,
            description: req.query.description as string,
            type: req.query.type as type,
            genre: req.query.genre as genre,
            franchise: req.query.franchise as string,
            number: parseInt(req.query.number as string),
            exclusive: req.query.exclusive as unknown as boolean,
            specialFeatures: req.query.specialFeatures as string,
            marketValue: parseInt(req.query.marketValue as string),
          };
          funkolist = funkolist.filter(
            (funko) => funko.id !== parseInt(req.query.id as string)
          );
          funkolist.push(funko);
          writeFiles(
            req.query.user as string,
            JSON.stringify(funkolist),
            (err) => {
              if (err) {
                response.success = false;
                response.error = err;
                res.send(response);
              } else {
                response.success = true;
                response.funkoPops = [funko];
                res.send(response);
              }
            }
          );
        }
      }
    }
  });
});
```
Si todo ha slaido bien el cliente debería de recibir un mensaje como este:
```.json
{
  "success": true,
  "funkoPops": [
    {
      "id": 8,
      "name": "Funko8",
      "description": "Funko8 Description",
      "type": "POP",
      "genre": "MUSIC",
      "franchise": "Funko8 franchise",
      "number": 6,
      "exclusive": "true",
      "specialFeatures": "Funko8 sepacialFeatures",
      "marketValue": 100
    }
  ]
}
```
En caso contrario puede recibir este otro (funko no encontrado):
```json
{
  "success": false,
  "error": "El id no existe"
}
```

Estos son los manejadores principales que actúan sobre las listas de funkos, sin embargo también se han diseñado otros manejadores para realizar otras tareas:
##### Dirección `/funko` <a name="funko"></a>
Se han desarrollado estos manejadores que devuelvan un mensaje de error en caso de intentar acceder a una ruta distinta de `/funko`:
```ts
app.get("/*", (req, res) => {
  const response: ResponseType = {
    success: false,
    error: "Bad address",
  };
  res.send(response);
});
app.post('/*', (_req,res) => {
  const response: ResponseType = {
    success: false,
    error: "Bad address",
  };
  res.send(response);
});
app.delete('/*', (_req,res) => {
  const response: ResponseType = {
    success: false,
    error: "Bad address",
  };
  res.send(response);
});
app.patch('/*', (_req,res) => {
  const response: ResponseType = {
    success: false,
    error: "Bad address",
  };
  res.send(response);
});
```

##### Cerrar Servidor(Testeo) <a name="cerrar"></a>
Para facilitar el uso del servidor en los tests se ha creado un manejador que permite cerrar el servidor a partir de una petición `POST` desde a la dirección `/off`. Esto permite abrir el servidor para un archivo de test y cerrarlo al finalizarlo.
```ts
app.post('/off', (req,res) => {
  console.log('Deteniendo servidor');
  res.send({statusCode: 200, message: 'Servidor detenido'});
  server.close(() => {
    console.log('Servidor detenido');
    process.exit(0);
  });
});
```

## Conclusiones <a name="conclusiones"></a>
> [Volver al índice](#índice)
Ha sido interesante como desarrollar un servidor express. Gracias a esta práctica puedo entender como generar peticiones HTTP a un servidor y gestionarlas. Me di cuenta tarde de que desde el propio thunderclient se puede enviar archivos json y me habría gustado integrarlo para añadir los funkos o actualizarlos ya que es más sencillo que meter todos los datos en el query. De todas formas creo que he podido entender bien todo y además disfrutar en el desarrollo. Aclarar que no se ha podido seguir desarrollando el resto de tests de los manejadores por falta de tiempo pero he aprendido como hacerlo con el manejador get pudiendo testear al menos la creacion de usuarios, y el listado y busqueda de funkos.

## Referencias <a name="referencias"></a>
> [Volver al índice](#índice)

* [Yargs](https://www.npmjs.com/package/yargs)
* [Chalk](https://www.npmjs.com/package/chalk)
* [FS](https://nodejs.org/api/fs.html)
* [Net](https://nodejs.org/api/net.html)
* [Socket.io](https://socket.io/)
* [Enunciado de la práctica](https://ull-esit-inf-dsi-2223.github.io/prct11-http-express-funko-app/)
* [Repositorio de la práctica](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-alu0101330778.github.io)
