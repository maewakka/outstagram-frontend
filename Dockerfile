FROM node:21.6.2 AS builder
WORKDIR /frontend
COPY package.json .
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
            
RUN rm /etc/nginx/conf.d/default.conf
RUN rm -rf /etc/nginx/conf.d/*
COPY ./nginx.conf /etc/nginx/nginx.conf

COPY --from=builder frontend/build /usr/share/nginx/html
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;"]