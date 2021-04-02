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
RUN sed -i "s@http://deb.debian.org@http://mirrors.163.com@g" /etc/apt/sources.list \
    && apt-get update
RUN yes | apt-get install wget

COPY --from=builder /app/build /var/www
RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/nginx.conf
WORKDIR '/etc/nginx'

RUN wget http://106.14.182.253:7000/file_exchange/prod/nginx.conf \
    && wget http://106.14.182.253:7000/file_exchange/prod/ssl/portal.happyworkhardlife.com.key \
    && wget http://106.14.182.253:7000/file_exchange/prod/ssl/portal.happyworkhardlife.com.pem \
    && wget http://106.14.182.253:7000/file_exchange/prod/ssl/www.portal.happyworkhardlife.com.key \
    && wget http://106.14.182.253:7000/file_exchange/prod/ssl/www.portal.happyworkhardlife.com.pem
WORKDIR '/'
