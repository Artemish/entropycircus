from http.server import *

def run(server_class=HTTPServer, handler_class=SimpleHTTPRequestHandler):
    print('Listening on http://localhost:8000')
    server_address = ('', 8000)
    httpd = server_class(server_address, handler_class)
    httpd.serve_forever()

if __name__ == '__main__':
    run()
