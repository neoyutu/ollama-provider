FROM node:lts-bullseye AS build

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM satantime/puppeteer-node:20.9.0-bookworm AS production

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY --from=build /usr/src/app/dist ./dist

CMD ["npm", "run", "start:prod"]
