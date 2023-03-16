FROM node:14.15.4-alpine
#FROM node:lts-alpine

# instalar un simple servidor http para servir nuestro contenido estático
RUN npm install -g http-server

# hacer la carpeta 'app' el directorio de trabajo actual
WORKDIR /app

# copiar 'package.json' y 'package-lock.json' (si están disponibles)
COPY package*.json ./

ENV WEBSOCKET_HOST localhost

ENV WEBSOCKET_PORT 3010

# instalar dependencias del proyecto
RUN apk add --no-cache git

RUN apk add --no-cache python

RUN npm install -g node-gyp

RUN apk add --virtual build-dependencies build-base gcc wget git

RUN git config --global url."https://".insteadOf git://

RUN npm install

# copiar los archivos y carpetas del proyecto al directorio de trabajo actual (es decir, la carpeta 'app')
COPY . .

# construir aplicación para producción minificada
RUN npm run build:prod

EXPOSE 8080
CMD [ "http-server", "dist" ]


LABEL MAINTAINER jclemente@prodevelop.es
