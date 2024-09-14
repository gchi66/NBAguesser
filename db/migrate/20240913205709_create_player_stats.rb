class CreatePlayerStats < ActiveRecord::Migration[7.0]
  def change
    create_table :player_stats do |t|
      t.integer :player_id
      t.integer :season_id
      t.decimal :points_per_game
      t.decimal :rebounds_per_game
      t.decimal :assists_per_game

      t.timestamps
    end
    add_foreign_key :player_stats, :players
    add_foreign_key :player_stats, :seasons
  end
end
