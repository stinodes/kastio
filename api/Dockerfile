# syntax=docker/dockerfile:1.4
FROM rust:buster AS base

ENV USER=root
ENV ENV=development

WORKDIR /code
RUN rustup default nightly 
RUN cargo init
RUN cargo install cargo-watch
RUN cargo install diesel_cli@2.0.0
COPY ./Cargo.toml /code/Cargo.toml
COPY ./Cargo.lock /code/Cargo.lock
# RUN cp src/secret.key.local src/secret.key
RUN cargo fetch
COPY ./src /code/src

FROM base AS development

EXPOSE 8000

FROM base AS dev-envs

EXPOSE 8000

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

FROM base AS builder

RUN cargo build --release --offline

FROM debian:buster-slim

ENV ENV=production

EXPOSE 8080

COPY --from=builder /code/target/release/kastio /kastio

CMD [ "/kastio" ]
