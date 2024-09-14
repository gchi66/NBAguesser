namespace :data do
  desc "Fetch player data and store in the database"
  task fetch_players: :environment do
    PagesController.new.fetch_players_data
    puts "Player data has been fetched and stored."
  end
end
