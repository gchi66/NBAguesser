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

  def find_correct_player
    if params[:season].present? && params[:season][:season].present?
      season = params[:season][:season]

      url = "https://www.basketball-reference.com/leagues/NBA_#{season}_per_game.html"


      doc = Nokogiri::HTML(URI.open(url))

      players_row = doc.css('tr').select do |row|
        row.at('th[scope="row"]')
      end
      # puts "Number of rows: #{players_row.count}"
      # puts players_row.first(3).map(&:to_html)
      selected_rows = players_row[1..450].to_a

      player_with_points = nil
      while player_with_points.nil?
        player_row = selected_rows.sample
        if player_row && player_row.at_css('td[data-stat="pts_per_g"]').text.to_f > 1
          player_with_points = parse_player_data(player_row)
        end
      end
      @correct_player = player_with_points || {}
      @correct_player[:id] = @correct_player[:player_id]
      session[:correct_player_name] = @correct_player[:name] if @correct_player[:name].present?
      session[:correct_player_image] = @correct_player[:image_url] if @correct_player[:image_url].present?
    end
  end

  def find_guess_players
    if params[:season].present? && params[:season][:season].present?
      season = params[:season][:season]

      url = "https://www.basketball-reference.com/leagues/NBA_#{season}_per_game.html"
      puts "Fetched URL: #{url}"

      doc = Nokogiri::HTML(URI.open(url))

      players_row = doc.css('tr').select do |row|
        row.at('th[scope="row"]')
      end
      puts "Number of rows fetched: #{players_row.count}"

      selected_rows = players_row[1..450].to_a

      @guess_players = selected_rows.sample(3).map do |player_row|
        parse_player_data(player_row)
      end
    else
      @guess_players = []
    end
  end

  def parse_player_data(player_row)
    return {} unless player_row

    player_link = player_row.at_css('td[data-stat="name_display"] a')
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
    session[:correct_player] = nil if session.key?(:correct_player)
    session[:guess_players] = nil if session.key?(:guess_players)
  end

end
