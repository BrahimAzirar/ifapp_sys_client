FROM node:22.5.1

WORKDIR /client

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]