FROM hookandloop/hl-base:1.0.0
MAINTAINER Hook & Loop Dev <hookandloopjenkins@gmail.com>

# Add supervisor config
ADD supervisor/* /etc/supervisor/conf.d/

WORKDIR /app

CMD ["/usr/bin/supervisord", "-n"]
