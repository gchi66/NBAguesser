require 'nokogiri'
require 'open-uri'
require 'net/http'

class PagesController < ApplicationController

  def home
    find_correct_player
    find_guess_players
    render 'home'
  end


  def find_correct_player
    if params[:season].present? && params[:season][:year].present?
      # querying the db instead of scraping
      @season = Season.find_by(year: params[:season][:year])
      player_stat = PlayerStat.joins(:player).where(season_id: @season.id).where('player_stats.points_per_game > ?', 1).sample
      @correct_player = player_stat.player
      session[:correct_player_name] = @correct_player.name
      session[:correct_player_image] = @correct_player.image_url


      # old scraping logic
      # season = params[:season][:season]
      # selected_rows = @players_data[season]

      # player_with_points = nil
      # while player_with_points.nil?
      #   player_row = selected_rows.sample
      #   if player_row && player_row.at_css('td[data-stat="pts_per_g"]').text.to_f > 1
      #     player_with_points = parse_player_data(player_row)
      #   end
      # end
      # @correct_player = player_with_points || {}
      # @correct_player[:id] = @correct_player[:player_id]
      # session[:correct_player_name] = @correct_player[:name] if @correct_player[:name].present?
      # session[:correct_player_image] = @correct_player[:image_url] if @correct_player[:image_url].present?
    end
  end

  def find_guess_players
    if params[:season].present? && params[:season][:year].present?
      @season = Season.find_by(year: params[:season][:year])
      @guess_players = PlayerStat.joins(:player).where(season_id: @season.id).sample(3).map(&:player)

      # old scraping logic
      # season = params[:season][:season]
      # selected_rows = @players_data[season]

      # @guess_players = selected_rows.sample(3).map do |player_row|
      #   parse_player_data(player_row)
      # end
    else
      @guess_players = []
    end
  end

  def fetch_players_data
    @players_data ||= {}

    # if params[:season].present? && params[:season][:season].present?
    season = 2023
    url = "https://www.basketball-reference.com/leagues/NBA_#{season}_per_game.html"

    doc = Nokogiri::HTML(URI.open(url))
    players_row = doc.css('tr').select do |row|
      row.at('th[scope="row"]')
    end
    @players_data[season] = players_row[1..450].to_a

    @players_data[season].each do |player_row|
      parse_player_data(player_row)
    end
    # end
  end

  def parse_player_data(player_row)
    return {} unless player_row

    player_link = player_row.at_css('td[data-stat="name_display"] a')
    profile_url = "https://www.basketball-reference.com#{player_link['href']}"
    player_id = player_link['href'].split('/').last.split('.').first
    team_name = player_row.at_css('td[data-stat="team_id"] a')&.text || "N/A"

    team = Team.find_or_create_by(name: team_name)

    player = Player.find_or_create_by(player_id: player_id) do |p|
      p.name = player_link.text
      p.team_id = team.id
      p.profile_url = profile_url
      p.image_url = fetch_player_image(profile_url)
    end

    if player.image_url.blank?
      player.update(image_url: fetch_player_image(profile_url))
    end

    season_year = '2023'
    season_id = Season.find_or_create_by(year: season_year).id
    PlayerStat.create!(
      player_id: player.id,
      season_id: season_id,
      points_per_game: player_row.at_css('td[data-stat="pts_per_g"]').text.to_f,
      rebounds_per_game: player_row.at_css('td[data-stat="trb_per_g"]').text.to_f,
      assists_per_game: player_row.at_css('td[data-stat="ast_per_g"]').text.to_f
    )

    {
      name: player.name,
      team: team.name,
      points: player.points_per_game,
      rebounds: player.rebounds_per_game,
      assists: player.assists_per_game,
      profile_url: profile_url,
      image_url: player.image_url,
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
    sleep(1.5) # Pause between requests

    img_tag['src'] if img_tag
  end


  def clear_correct_player_session
    session[:correct_player_name] = nil
    session[:correct_player_image] = nil
    session[:correct_player] = nil if session.key?(:correct_player)
    session[:guess_players] = nil if session.key?(:guess_players)
  end

end
