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
      if @season.nil?
        Rails.logger.error("Season not found for year #{params[:season][:year]}")
        return
      end
      player_stat = PlayerStat.joins(:player).where(season_id: @season.id).where('player_stats.points_per_game > ?', 1).sample
      Rails.logger.info("Player stats found: #{player_stat.inspect}")
      if player_stat.nil?
        Rails.logger.error("No player_stat found for season #{@season.id}")
        return
      end
      @correct_player = player_stat.player
      if @correct_player.nil?
        Rails.logger.error("No player associated with player_stat #{player_stat.id}")
        return
      end
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

  def fetch_players_data(seasons = (1950..2024).to_a)
    @players_data ||= {}

    # if params[:season].present? && params[:season][:season].present?

    puts Time.now

    seasons.each do |season|
      url = "https://www.basketball-reference.com/leagues/NBA_#{season}_per_game.html"

      doc = Nokogiri::HTML(URI.open(url))
      players_row = doc.css('tr').select do |row|
        row.at('th[scope="row"]')
      end
      @players_data[season] = players_row[1..-1].to_a

      @players_data[season].each_with_index do |player_row, index|
        parse_player_data(player_row, season, index)
      end
      puts "Finished processing season #{season}"
    end
  end

  def parse_player_data(player_row, season_year, index)
    return {} unless player_row

    player_link = player_row.at_css('td[data-stat="name_display"] a')
    return {} unless player_link

    player_name = player_link&.text || "Unknown Player"
    player_id = player_link['href'].split('/').last.split('.').first
    team_name = player_row.at_css('td[data-stat="team_id"] a')&.text || "N/A"

    # Log progress every 50 players
    if index % 50 == 0
      puts "Processing player #{index}: #{player_name} for season #{season_year}..."
    end

    # Find or create the season
    season = Season.find_or_create_by(year: season_year)

    # Find or create the player and team
    team = Team.find_or_create_by(name: team_name)
    player = Player.find_or_create_by(player_id: player_id) do |p|
      p.name = player_name
      p.team_id = team.id
      p.profile_url = "https://www.basketball-reference.com#{player_link['href']}"
    end

    # Check if player stats for this season already exist
    existing_stats = PlayerStat.find_by(player_id: player.id, season_id: season.id)
    if existing_stats
      puts "Player stats for #{player_name} in season #{season_year} already exist. Skipping..."
      return
    end

    # Fetch player image if missing
    if player.image_url.blank?
      player_image = fetch_player_image(player.profile_url)
      player.update(image_url: player_image)
    end

    # Create player stats if available
    points = player_row.at_css('td[data-stat="pts_per_g"]')&.text.to_f
    rebounds = player_row.at_css('td[data-stat="trb_per_g"]')&.text.to_f
    assists = player_row.at_css('td[data-stat="ast_per_g"]')&.text.to_f

    if points && rebounds && assists
      PlayerStat.create!(
        player_id: player.id,
        season_id: season.id,
        points_per_game: points,
        rebounds_per_game: rebounds,
        assists_per_game: assists
      )
    end

    {
      name: player.name,
      team: team.name,
      points: points,
      rebounds: rebounds,
      assists: assists,
      profile_url: player.profile_url,
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
    sleep(2) # Pause between requests

    img_tag['src'] if img_tag
  end


  def clear_correct_player_session
    session[:correct_player_name] = nil
    session[:correct_player_image] = nil
    session[:correct_player] = nil if session.key?(:correct_player)
    session[:guess_players] = nil if session.key?(:guess_players)
  end

end
