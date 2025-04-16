## Ejecutar repo en local con docker


### Instalar dependencias
```
yarn install
```
### Crear archivo .env
```
sudo cp .env.example .env
```
### Ejecutar docker para BD
Crear carpeta **mysql_data** si no existe
```
sudo mkdir mysql_data
sudo chmod 777 mysql_data
```
Ejecutar docker para la bd
```
docker compose up -d
```
## Ejecutar app
**Solo si no tengo la bd creada en local**
```
yarn db:create
yarn seed:run
```
(*) Asociar los id para las tablas **posts_documentos** y **posts_imagenes**

Ejecutar app
```
yarn dev
```