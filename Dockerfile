FROM ubuntu:22.04

WORKDIR /app

RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    build-essential \
    git \
    wget \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="${PATH}:/root/.bun/bin"

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="${PATH}:/root/.cargo/bin"

RUN bun --version && \
    cargo --version

COPY index.html ./
COPY server.ts ./

RUN mkdir -p ./temp

RUN cargo install bend-lang && \ 
    cargo install hvm

EXPOSE 3000

CMD ["bun", "run", "server.ts"]
