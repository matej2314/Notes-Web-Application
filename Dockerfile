FROM node:20.18.0

WORKDIR /app

COPY package*.json  .

COPY . .

RUN rm -rf node_modules && npm install 

EXPOSE 8088

CMD [ "node", "server.js" ] 

