FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

COPY wait-for-db.sh /usr/local/bin/

RUN npm run build

EXPOSE 3000

CMD ["sh", "/usr/local/bin/wait-for-db.sh", "db", "5432", "npm", "run", "start:prod"]
