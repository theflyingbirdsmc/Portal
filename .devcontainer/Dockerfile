FROM ubuntu:22.04

RUN apt-get update \
	&& apt-get install -y \
	curl \
	git \
	sudo \
	nano \
	wget \
	zip \ 
	unzip \
    libsqlite3-dev \
    python3 \
    build-essential \
	make \
	&& rm -rf /var/lib/apt/lists/*

# Install NodeJS for Backstage development
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && \
    sudo apt-get install -y nodejs
RUN npm install -g yarn
EXPOSE 3000
EXPOSE 7007

ARG USER=coder
RUN useradd --groups sudo --no-create-home --shell /bin/bash ${USER} \
	&& echo "${USER} ALL=(ALL) NOPASSWD:ALL" >/etc/sudoers.d/${USER} \
	&& chmod 0440 /etc/sudoers.d/${USER}
USER ${USER}
WORKDIR /home/${USER}