class Device < ApplicationRecord
  has_many :user_guesses_for_devices
end
