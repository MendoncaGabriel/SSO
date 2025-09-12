FROM node:22.18.0

WORKDIR /app

RUN apt-get update && apt-get install -y ca-certificates curl && update-ca-certificates

ENV NODE_TLS_REJECT_UNAUTHORIZED=0

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run setup
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
