FROM node:12.14.1-slim

WORKDIR  /publish

COPY . .
# RUN npm install


EXPOSE 5004
