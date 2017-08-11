import SimpleHTTPServer
import SocketServer
class myHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
   def do_GET(self):
       print self.path
       self.send_response(301)
       self.send_header('Location', "https://{0}/".format(self.headers['Host']))
       self.end_headers()

PORT = 80
handler = SocketServer.TCPServer(("", PORT), myHandler)
print "serving at port ", PORT
handler.serve_forever()
