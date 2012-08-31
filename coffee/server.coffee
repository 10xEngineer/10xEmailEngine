nodemailer = require 'nodemailer'
jade = require 'jade'
fs = require 'fs'
path = require 'path'
vm = require 'vm'
transport = ''
templates = ''

setTransport = (options)->
  transport = nodemailer.createTransport 'SMTP', options
  
setTemplates = (templateDir)->
  templates = fs.realpathSync templateDir
  
sendMail = (options, callback)->
  {template, data} = options
  
  renderTemplate template, data, (err, contents)->
    if err then callback? err
    else
      getMailOptions template, data, (err, mailOptions)->
        if err then callback? err
        else
          transport.sendMail mailOptions, callback

renderTemplate = (template, data, callback)->
  templatePath = path.join templates, "#{template}.jade"
  fs.readFile templatePath, (err, templateString)->
    if err then callback err
    else
      tmplFn = jade.compile templateString
      callback null, tmplFn data

getMailOptions = (template, options, callback)->
  configPath = path.join templates, "#{template}.conf"
  fs.exists configPath, (exists)->
    if exists
      fs.readFile configPath, (err, configString)->
        if err then callback err
        else
          vm.runInNewContext configString, options
          callback null, options
    else
      options.generateTextFromHTML ?= yes
      callback null, options

module.exports = {setTransport, setTemplates, sendMail}