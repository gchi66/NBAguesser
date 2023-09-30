Dotenv.load Rails.root.join('.env') unless ENV['RAILS_ENV'] == 'production'
