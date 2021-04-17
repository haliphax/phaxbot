FROM python:3.8-slim-buster
WORKDIR /app
ADD ./requirements.txt /app/
ADD ./wwwroot /app/wwwroot/
ADD ./bot /app/bot/
RUN /bin/bash -c "useradd -u 1000 bot \
	&& pip install --no-cache-dir -U pip \
	&& pip install --no-cache-dir -r requirements.txt \
	&& chown -R bot:bot /app"
USER 1000
VOLUME ["/app/commands", "/app/configs", "/app/mods", "/app/database.sqlite"]
CMD ["python", "-m", "bot"]
