FROM node:alpine as builder

COPY public ./app/public
COPY src ./app/src
COPY env ./app/env
COPY craco.config.js ./app
COPY package.json ./app
COPY package-lock.json ./app
COPY tsconfig.json ./app
COPY type.d.ts ./app
COPY yarn.lock ./app

WORKDIR '/app'

RUN npm config set registry https://registry.npm.taobao.org
RUN yarn install
RUN yarn build


FROM nginx
EXPOSE 80
EXPOSE 443

COPY --from=builder /app/build /var/www

RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/nginx.conf
