FROM debian:9.5-slim

WORKDIR /app

ARG BASE_TOOL="ca-certificates curl git iputils-ping less net-tools procps vim xz-utils"
RUN apt-get update \
	&& apt-get upgrade -y \
  && apt-get install $BASE_TOOL -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/* \
  && apt-get clean

RUN mkdir -p /opt/node \
  && cd /opt/node \
  && curl -O "https://nodejs.org/dist/v10.14.2/node-v10.14.2-linux-x64.tar.xz" \
  && tar xf node-v10.14.2-linux-x64.tar.xz \
  && mv node-v10.14.2-linux-x64 v10.14.2 \
  && ln -s /opt/node/v10.14.2 /opt/node/current \
  && ln -s /opt/node/current/bin/* /usr/bin/

COPY release.js web.js package.json package-lock.json /app/
RUN npm install

