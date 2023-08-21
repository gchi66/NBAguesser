class CreateUserGuessesForDevices < ActiveRecord::Migration[7.0]
  def change
    create_table :user_guesses_for_devices do |t|
      t.references :device, null: false, foreign_key: true
      t.string :guess
      t.boolean :correct

      t.timestamps
    end
  end
end
