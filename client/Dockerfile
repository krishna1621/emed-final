FROM node:alpine
WORKDIR /emed-final/client
ENV PATH="/client/node_modules/.bin:$PATH"
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY  . ./
RUN npm run build

WORKDIR /emed-final/server
ENV PATH="server/node_modules/.bin:$PATH"
COPY package.json ./
COPY package-lock.json ./
COPY  . ./
EXPOSE 4000
CMD ["node", "index.js"]
