require 'uri'
require 'net/http'
require 'openssl'
require 'json'

class NbaApi

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
  #   data = JSON.parse(response.read_body)
  #   formatted_response = JSON.pretty_generate(data)
  #   puts "Formatted Response Body:"
  #   puts formatted_response

  #   processed_data = []

  #   if data['response'].present?
  #     processed_data = data['response'].map do |player_data|
  #       team = player_data['team']
  #       player = player_data['player']
  #       {
  #         name: "#{player['firstname']} #{player['lastname']}",
  #         team: team ? team['name'] : 'Unknown',
  #         image_url: team ? team['logo'] : '',
  #         points: player_data['points'] || 0,
  #         rebounds: player_data['totReb'] || 0,
  #         assists: player_data['assists'] || 0
  #         # Add other necessary player stats
  #       }
  #     end
  #   end
  #   puts processed_data[0]
  #   return processed_data[0]

  # end

  def get_player_stats(season)

    puts "Fetching player stats for a random player in season #{season}"
    url = URI("https://www.balldontlie.io/api/v1/season_averages?player_ids[]=15")


    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(url)
    response = http.request(request)

    # Check the response code
    puts "Response Code: #{response.code}"

    # Check the response body
    data = JSON.parse(response.body)
    puts data

    player_stats = data['data']

    if player_stats.present?
      matching_players = player_stats.select { |player| player['season'] == season }
      if matching_players.empty?
        puts "No statistics found for season #{season}"
        return {}
      else
        player_data = matching_players.sample
        {
          player_id: player_data['player_id'],
          name: "#{player_data['player']['first_name']} #{player_data['player']['last_name']}",
          team: player_data['team']['full_name'],
          points: player_data['pts'],
          rebounds: player_data['reb'],
          assists: player_data['ast']
        }
      end
    else
      puts "No statistics found for the random player in season #{season}"
      return {}
    end

    return player_data


  end
end
