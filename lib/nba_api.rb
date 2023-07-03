require 'uri'
require 'net/http'
require 'openssl'
require 'json'

class NbaApi
  def get_player_stats(season)
    puts "Fetching player stats for season: #{season}"
    player_id = rand(1..450)
    url = URI("https://api-nba-v1.p.rapidapi.com/players/statistics?id=#{player_id}&season=#{season}")
    api_key = ENV.fetch('NBA_API_KEY')

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE

    request = Net::HTTP::Get.new(url)
    request["X-RapidAPI-Key"] = api_key
    request["X-RapidAPI-Host"] = 'api-nba-v1.p.rapidapi.com'

    response = http.request(request)
    # Check the response code
    puts "Response Code: #{response.code}"

    # Check the response headers
    puts "Response Headers:"
    response.each_header do |key, value|
      puts "#{key}: #{value}"
    end

    # Check the response body
    puts "Response Body:"
    puts response.body
    data = JSON.parse(response.read_body)
    processed_data = data['response'].map do |player|
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
