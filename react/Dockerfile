# syntax=docker/dockerfile:1.4
FROM node:lts AS development

WORKDIR /code
COPY package.json /code/package.json
COPY yarn.lock /code/yarn.lock
RUN yarn
COPY . /code

FROM development as dev-envs
RUN <<EOF
apt-get update
apt-get install -y --no-install-recommends git
EOF

RUN <<EOF
useradd -s /bin/bash -m vscode
groupadd docker
usermod -aG docker vscode
EOF
# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /

FROM development AS builder

RUN yarn build

FROM nginx:1.13-alpine

COPY --from=builder /code/build /usr/share/nginx/html
