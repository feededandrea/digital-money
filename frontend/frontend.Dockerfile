FROM node:20

WORKDIR /app

# Copiá solo los archivos de dependencias primero
COPY package*.json ./

# Instalá dependencias
RUN npm install --legacy-peer-deps

COPY . ./

EXPOSE 3000

CMD ["npm", "run", "dev"]