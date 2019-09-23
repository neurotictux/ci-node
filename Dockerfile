FROM ubuntu:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN apt update
ENV NODE_ENV test
EXPOSE 8085
CMD [ "npm", "start" ]