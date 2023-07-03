require 'nba_api'

class PagesController < ApplicationController
  def home
    api = NbaApi.new
    @player_stats = api.get_player_stats(params[:season][:season]) if params[:season]
    puts @player_stats
  end
end
