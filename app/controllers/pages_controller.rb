require 'nba_api'
require 'nokogiri'
require 'open-uri'
class PagesController < ApplicationController

  def home
    if params[:season].present? && params[:season][:season].present?
      season = params[:season][:season]

      url = "https://www.basketball-reference.com/leagues/NBA_#{season}_per_game.html"

      doc = Nokogiri::HTML(URI.open(url))

      puts doc

      players_row = doc.css('tr.full_table')

      selected_rows = players_row[1..380].to_a

      player_row = selected_rows.sample

      puts "HERE IS THE FUCKING PLAYER ROW YOU CUNTBAG:"
      puts player_row

      if player_row
        @random_player = parse_player_data(player_row)
      else
        @random_player = {}
      end
    end
    render 'home'
  end

  def parse_player_data(player_row)


    {
      name: player_row.at('td[data-stat="player"]').text,
      team: player_row.at('td[data-stat="team_id"] a').text,
      points: player_row.at('td[data-stat="pts_per_g"]').text,
      rebounds: player_row.at('td[data-stat="trb_per_g"]').text,
      assists: player_row.at('td[data-stat="ast_per_g"]').text
    }
  end

  # private

  # def random_player(season)


  # end

end


  # def home
  #   season = params.dig(:season, :season)
  #   api = NbaApi.new
  #   @random_player = api.get_player_stats(season)
  # end

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
