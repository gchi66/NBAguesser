require 'nba_api'

class PagesController < ApplicationController
  def home
    season = params.dig(:season, :season)
    api = NbaApi.new
    @random_player = api.get_player_stats(season)
  end
end



# def process_player_stats(response)
#   players = response['response']
#   return [] if players.nil? || players.empty?

#   players.map do |player_data|
#     player = player_data['player']
#     team = player_data['team']
#     {
#       name: "#{player['firstname']} #{player['lastname']}",
#       team: team['name'],
#       image_url: team['logo'],
#       points: player_data['points'],
#       rebounds: player_data['totReb'],
#       assists: player_data['assists']
#       # Add other necessary player stats
#     }
#   end
# end

# def get_player_stats(season)
#   puts "Fetching player stats for season: #{season}"
#   player_id = rand(1..450)
#   url = URI("https://api-nba-v1.p.rapidapi.com/players/statistics?id=#{player_id}&season=#{season}")
#   api_key = ENV.fetch('NBA_API_KEY')

#   http = Net::HTTP.new(url.host, url.port)
#   http.use_ssl = true
#   http.verify_mode = OpenSSL::SSL::VERIFY_NONE

#   request = Net::HTTP::Get.new(url)
#   request["X-RapidAPI-Key"] = api_key
#   request["X-RapidAPI-Host"] = 'api-nba-v1.p.rapidapi.com'

#   response = http.request(request)
#   # Check the response code
#   puts "Response Code: #{response.code}"

#   # Check the response headers
#   puts "Response Headers:"
#   response.each_header do |key, value|
#     puts "#{key}: #{value}"
#   end

#   # Check the response body
#   puts "Response Body:"
#   puts response.body

#   data = JSON.parse(response.body)
#   processed_data = process_player_stats(data)
#   return processed_data[0]

# end
