import webapp2,os,subprocess

class MainPage(webapp2.RequestHandler):
  def get(self):
      file = open("test2.txt", 'w')	
      file.write("testing")
      file = open("test.txt", 'w')
      file.write("test")
      file.close()
      self.response.headers['Content-Type'] = 'text/plain'
      self.response.write('Hello, webapp2 World!\n')
      self.response.write('creating anand2.txt using os.system call : \n')
      res= os.system("touch anand2.txt")
      #self.response.write(res) 
      self.response.write('printing the list of files in the directory using os.open call : \n') 
      process = os.popen('./StochKit2.0.6/ssa -m dimer_decay.xml -t 10 -r 1000')
      res= process.read()
      self.response.write(res)
      process.close()
      self.response.out.write(dir(subprocess))
app = webapp2.WSGIApplication([('/', MainPage)],
                              debug=True)

