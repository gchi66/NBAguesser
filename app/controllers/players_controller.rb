class PlayersController < ApplicationController
  def index

  end
  def player_stats
    season = params[:season] # Retrieve the selected season from the params

    # Fetch player statistics for the selected season using the get_player_stats method
    @player_stats = get_player_stats(season)
  end

  private

  def get_player_stats(season)
    # Implementation to fetch player statistics for the selected season
    # ...
  end

  def show
    # Fetch player details using player ID
    @player = NBAApi.get_player(params[:id])
  end

  def stats
    # Fetch player statistics using player ID
    @player_stats = NBAApi.get_player_stats(params[:id])
  end

  def fg_percentage
    # Fetch player field goal percentage using player ID
    @fg_percentage = NBAApi.get_player_fg_percentage(params[:id])
  end


end
