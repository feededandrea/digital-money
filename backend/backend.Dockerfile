FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copiamos todo lo que está dentro del contexto, incluyendo prisma y .env
COPY . .

RUN npx prisma generate

EXPOSE 4000

CMD ["npm", "start"]