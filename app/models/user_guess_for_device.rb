class UserGuessForDevice < ApplicationRecord
  self.table_name = "user_guesses_for_devices"
  belongs_to :device
end
