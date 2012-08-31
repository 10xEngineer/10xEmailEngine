emailEngine = require './index'

emailEngine.setTransport
  service : 'Gmail'
  auth :
    user : '10xengineer@gmail.com'
    pass : 'password'
    
emailEngine.setTemplates './templates'

emailEngine.sendMail
  template : 'testTemplate'
  # type : 'html' # | text
  data :
    to : 'saleem.abdulhamid@me.com'
    from : '10xEngineer@gmail.com'
    name : 'Saleem'
, (err, response)->
  console.log err, response