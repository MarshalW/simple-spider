FROM node:13.8.0-buster

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# node -r esm app
CMD [ "node", "-r esm app" ]
