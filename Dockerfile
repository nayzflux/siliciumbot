FROM node:latest

WORKDIR /app

COPY . .

RUN npm install --production-only

RUN mkdir /temp/downloads

CMD ["npm", "start"]