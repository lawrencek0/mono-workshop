require 'rubygems'
require 'bundler'

$stdout.sync = true
Bundler.require(:rack)

port = (ARGV.first || ENV['PORT'] || 3000).to_i
env = ENV['RACK_ENV'] || 'development'

require 'em-proxy'
require 'logger'
require 'heroku-forward'
require 'heroku/forward/backends/puma'

application = File.expand_path('../my_app.ru', __FILE__)
config_file = File.expand_path('../config/puma.rb', __FILE__)
backend = Heroku::Forward::Backends::Puma.new(application: application, env: env, config_file: config_file)
proxy = Heroku::Forward::Proxy::Server.new(backend, host: '0.0.0.0', port: port)
proxy.forward!