namespace :data do
  desc "Fetch missing images for players past 1970"
  task fetch_missing_images: :environment do
    players_without_images = Player.joins(:player_stats)
                                   .where(player_stats: { season_id: Season.where('year > ?', 1970).pluck(:id) })
                                   .where(image_url: [nil, ''])

    players_without_images.each do |player|
      puts "Fetching image for #{player.name}..."

      if player.profile_url.present?
        image_url = PagesController.new.fetch_player_image(player.profile_url)

        if image_url.present?
          player.update(image_url: image_url)
          puts "Updated image for #{player.name} at #{image_url}."
        else
          puts "No image found for #{player.name} at #{player.profile_url}."
        end
      else
        puts "No profile URL for #{player.name}. Skipping..."
      end
    end
  end
end
