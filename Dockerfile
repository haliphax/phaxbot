FROM python:3.8-slim-buster
WORKDIR /app
ADD ./requirements.txt /app/
ADD ./wwwroot /app/wwwroot/
ADD ./bot /app/bot/
RUN /bin/bash -c "useradd -u 1000 yokai \
	&& pip install --no-cache-dir -U pip \
	&& pip install --no-cache-dir -r requirements.txt \
	&& chown -R yokai:yokai /app \
	&& ln -s /app/avatars.json /app/wwwroot/docker.json"
USER 1000
VOLUME ["/app/commands", "/app/configs", "/app/mods", "/app/database.sqlite", "/app/wwwroot/choices.json"]
CMD ["python", "-m", "bot"]
