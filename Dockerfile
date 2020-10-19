FROM node:12.2.0-alpine

WORKDIR /usr/

COPY package.json ./

COPY tsconfig.json ./

RUN npm install

COPY src /usr/


ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

RUN npm run build


EXPOSE 19093

CMD ["sh", "-c", "/wait && npm run start"]