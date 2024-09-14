class CreatePlayers < ActiveRecord::Migration[7.0]
  def change
    create_table :players do |t|
      t.string :name
      t.integer :team_id
      t.decimal :points_per_game
      t.decimal :rebounds_per_game
      t.decimal :assists_per_game
      t.text :profile_url
      t.text :image_url
      t.string :player_id

      t.timestamps
    end

    add_foreign_key :players, :teams
  end
end
