FROM node:lts-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY public ./public
COPY src ./src
EXPOSE 3000
CMD ["npm", "start"]