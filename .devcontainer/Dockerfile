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
	node \
    libsqlite3-dev \
    python3 \
    build-essential \
	&& rm -rf /var/lib/apt/lists/*

# Install NodeJS for Backstage development
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && \
    sudo apt-get install -y nodejs

EXPOSE 3000
EXPOSE 7007
# EXPOSE 3306

# RUN sudo service mariadb start && sudo mysql -u root < /docker-entrypoint-initdb.d/init.sql
ARG USER=coder
RUN useradd --groups sudo --no-create-home --shell /bin/bash ${USER} \
	&& echo "${USER} ALL=(ALL) NOPASSWD:ALL" >/etc/sudoers.d/${USER} \
	&& chmod 0440 /etc/sudoers.d/${USER}
USER ${USER}
WORKDIR /home/${USER}