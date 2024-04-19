# Establece la imagen base
FROM node:16-alpine

# Instala dockerize
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Crea y establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de paquetes y los instala
COPY package*.json ./
RUN npm install

# Copia el resto del código fuente de la aplicación
COPY . .

# Compila la aplicación
RUN npm run build

# Expone el puerto que tu aplicación utiliza
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["dockerize", "-wait", "tcp://kafka:9092", "-timeout", "60s", "npm", "run", "start:prod"]