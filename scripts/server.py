#! /usr/bin/env python3

import os
import sys
import argparse
import http.server


def main():
    os.chdir(args.dir)  # Change working dir to serve files from.
    server_address = ('', args.port)
    handler = http.server.SimpleHTTPRequestHandler

    httpd = http.server.HTTPServer(server_address, handler)

    print("Serving HTTP on", httpd.server_name,
          "port", httpd.server_port, "...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.server_close()
        print("\nServer closed ...")


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    default_path = os.path.join(os.getcwd(), "web")
    parser.add_argument('--port', '-p', default=8000, type=int)
    parser.add_argument('--dir', '-d', default=default_path, type=str)
    args = parser.parse_args()
    sys.stderr = open('/var/log/http_server.log', 'a')

    main()
