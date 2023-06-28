require 'uri'
require 'net/http'
require 'openssl'
require 'json'

def get_seasons
  url = URI("https://api-nba-v1.p.rapidapi.com/seasons")
  api_key = ENV.fetch('NBA_API_KEY')

  http = Net::HTTP.new(url.host, url.port)
  http.use_ssl = true
  http.verify_mode = OpenSSL::SSL::VERIFY_NONE

  request = Net::HTTP::Get.new(url)
  request["X-RapidAPI-Key"] = api_key
  request["X-RapidAPI-Host"] = 'api-nba-v1.p.rapidapi.com'

  response = http.request(request)
  data = JSON.parse(response.read_body)
  return data

def get_teams
  url = URI("https://api-nba-v1.p.rapidapi.com/teams")
  api_key = ENV.fetch('NBA_API_KEY')

  http = Net::HTTP.new(url.host, url.port)
  http.use_ssl = true
  http.verify_mode = OpenSSL::SSL::VERIFY_NONE

  request = Net::HTTP::Get.new(url)
  request["X-RapidAPI-Key"] = api_key
  request["X-RapidAPI-Host"] = 'api-nba-v1.p.rapidapi.com'

  response = http.request(request)
  data = JSON.parse(response.read_body)
  return data
end

def get_player_stats(season)
  url = URI("https://api-nba-v1.p.rapidapi.com/players?#{season}")
  api_key = ENV.fetch('NBA_API_KEY')

  http = Net::HTTP.new(url.host, url.port)
  http.use_ssl = true
  http.verify_mode = OpenSSL::SSL::VERIFY_NONE

  request = Net::HTTP::Get.new(url)
  request["X-RapidAPI-Key"] = api_key
  request["X-RapidAPI-Host"] = 'api-nba-v1.p.rapidapi.com'

  response = http.request(request)
  data = JSON.parse(response.read_body)
  processed_data = data['api']['statistics'].map do |player|
    {
      name: player['name'],
      team: player['team'],
      image_url: player['image_url'],
      points: player['pts'],
      rebounds: player['reb'],
      assists: player['ast']
      # Other player stats...
    }
  end

  return processed_data
end


end
