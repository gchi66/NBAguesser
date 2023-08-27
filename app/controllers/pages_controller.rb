require 'nokogiri'
require 'open-uri'
require 'net/http'

class PagesController < ApplicationController

  def home
    clear_correct_player_session
    find_correct_player
    find_guess_players
    render 'home'
  end

  def create
    user_device_id = session[:user_device_id] ||= SecureRandom.uuid
    device = Device.find_or_create_by(uuid: user_device_id)
    user_guess = params[:guess]["guess"]
    if user_guess == session[:correct_player_name]
      UserGuessForDevice.create(device_id: device.id, correct: true)
    else
      UserGuessForDevice.create(device_id: device.id, correct: false)
    end
  end

  # def show_user_guesses
  #   device_id = session[:user_device_id]
  #   user_guesses = UserGuessForDevice.where(device_id: device_id)
  #   # Use user_guesses as needed
  # end

  def find_correct_player
    if params[:season].present? && params[:season][:season].present?
      season = params[:season][:season]

      url = "https://www.basketball-reference.com/leagues/NBA_#{season}_per_game.html"

      doc = Nokogiri::HTML(URI.open(url))

      players_row = doc.css('tr.full_table')

      selected_rows = players_row[1..380].to_a

      player_with_points = nil
      while player_with_points.nil?
        player_row = selected_rows.sample
        if player_row && player_row.at_css('td[data-stat="pts_per_g"]').text.to_f > 1
          player_with_points = parse_player_data(player_row)
        end
      end
      @correct_player = player_with_points || {}
      session[:correct_player_name] = @correct_player[:name] if @correct_player[:name].present?
      session[:correct_player_image] = @correct_player[:image_url] if @correct_player[:image_url].present?
    end
  end

  def find_guess_players
    if params[:season].present? && params[:season][:season].present?
      season = params[:season][:season]

      url = "https://www.basketball-reference.com/leagues/NBA_#{season}_per_game.html"

      doc = Nokogiri::HTML(URI.open(url))

      players_row = doc.css('tr.full_table')

      selected_rows = players_row[1..380].to_a

      @guess_players = selected_rows.sample(3).map do |player_row|
        parse_player_data(player_row)
      end
    else
      @guess_players = []
    end
  end

  def parse_player_data(player_row)
    return {} unless player_row

    player_link = player_row.at_css('td[data-stat="player"] a')
    profile_url = "https://www.basketball-reference.com#{player_link['href']}"
    player_id = player_link['href'].split('/').last.split('.').first

    {
      name: player_link.text,
      team: player_row.at_css('td[data-stat="team_id"] a')&.text || "N/A",
      points: player_row.at_css('td[data-stat="pts_per_g"]').text,
      rebounds: player_row.at_css('td[data-stat="trb_per_g"]').text,
      assists: player_row.at_css('td[data-stat="ast_per_g"]').text,
      profile_url: profile_url,
      image_url: fetch_player_image(profile_url),
      player_id: player_id
    }
  end

  def fetch_player_image(profile_url)
    return nil unless profile_url

    img_tag = nil
    begin
      uri = URI.parse(profile_url)
      return nil unless uri.is_a?(URI::HTTP) || uri.is_a?(URI::HTTPS)

      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true if uri.scheme == 'https'

      response = http.get(uri.request_uri)

      if response.is_a?(Net::HTTPSuccess)
        doc = Nokogiri::HTML(response.body)
        img_tag = doc.at_css('img[itemscope="image"]')

      else
        puts "Error fetching player image: #{response.message}"
      end
    rescue StandardError => e
      puts "Error fetching player image: #{e.message}"
    end

    img_tag['src'] if img_tag

  end

  def clear_correct_player_session
    session[:correct_player_name] = nil
    session[:correct_player_image] = nil
  end

end
