// Generated by CoffeeScript 1.3.3
(function() {
  var fs, getMailOptions, jade, nodemailer, path, renderTemplate, sendMail, setTemplates, setTransport, templates, transport, vm;

  nodemailer = require('nodemailer');

  jade = require('jade');

  fs = require('fs');

  path = require('path');

  vm = require('vm');

  transport = '';

  templates = '';

  setTransport = function(options) {
    return transport = nodemailer.createTransport('SMTP', options);
  };

  setTemplates = function(templateDir) {
    return templates = fs.realpathSync(templateDir);
  };

  sendMail = function(options, callback) {
    var data, template;
    template = options.template, data = options.data;
    return renderTemplate(template, data, function(err, contents) {
      if (err) {
        return typeof callback === "function" ? callback(err) : void 0;
      } else {
        return getMailOptions(template, data, function(err, mailOptions) {
          if (err) {
            return typeof callback === "function" ? callback(err) : void 0;
          } else {
            return transport.sendMail(mailOptions, callback);
          }
        });
      }
    });
  };

  renderTemplate = function(template, data, callback) {
    var templatePath;
    templatePath = path.join(templates, "" + template + ".jade");
    return fs.readFile(templatePath, function(err, templateString) {
      var tmplFn;
      if (err) {
        return callback(err);
      } else {
        tmplFn = jade.compile(templateString);
        return callback(null, tmplFn(data));
      }
    });
  };

  getMailOptions = function(template, options, callback) {
    var configPath;
    configPath = path.join(templates, "" + template + ".conf");
    return fs.exists(configPath, function(exists) {
      var _ref;
      if (exists) {
        return fs.readFile(configPath, function(err, configString) {
          if (err) {
            return callback(err);
          } else {
            vm.runInNewContext(configString, options);
            return callback(null, options);
          }
        });
      } else {
        if ((_ref = options.generateTextFromHTML) == null) {
          options.generateTextFromHTML = true;
        }
        return callback(null, options);
      }
    });
  };

  module.exports = {
    setTransport: setTransport,
    setTemplates: setTemplates,
    sendMail: sendMail
  };

}).call(this);
