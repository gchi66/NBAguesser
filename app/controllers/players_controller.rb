class PlayersController < ApplicationController
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

  # Add more actions as needed for different types of player data

  # ...
end
