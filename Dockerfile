FROM node:22-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm update

EXPOSE 3000

CMD [ "npm", "run", "start" ]