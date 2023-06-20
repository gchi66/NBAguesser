require 'uri'
require 'net/http'
require 'openssl'

url = URI("https://api-nba-v1.p.rapidapi.com/seasons")
api_key = ENV.fetch['NBA_API_KEY']

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true
http.verify_mode = OpenSSL::SSL::VERIFY_NONE

request = Net::HTTP::Get.new(url)
request["X-RapidAPI-Key"] = api_key
request["X-RapidAPI-Host"] = 'api-nba-v1.p.rapidapi.com'

response = http.request(request)
puts response.read_body
