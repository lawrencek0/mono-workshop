require 'rubygems'
require 'bundler'
require 'rack-zippy'

$stdout.sync = true
Bundler.require(:rack)

port = (ARGV.first || ENV['PORT'] || 3000).to_i
env = ENV['RACK_ENV'] || 'development'

require 'em-proxy'
require 'logger'
require 'heroku-forward'
require 'heroku/forward/backends/puma'

# Set asset_root to an absolute or relative path to the directory holding your asset files
# e.g. '/path/to/my/apps/static-assets' or 'public'
asset_root = '/path/to/my/apps/public'
use Rack::Zippy::AssetServer, asset_root
application = File.expand_path('../my_app.ru', __FILE__)
config_file = File.expand_path('../config/puma.rb', __FILE__)
backend = Heroku::Forward::Backends::Puma.new(application: application, env: env, config_file: config_file)
proxy = Heroku::Forward::Proxy::Server.new(backend, host: '0.0.0.0', port: port)
proxy.forward!