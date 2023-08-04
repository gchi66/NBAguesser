Rails.application.routes.draw do
  root to: "pages#home"
  post '/', to: "pages#home"
  get '/pages/win', to: 'pages#win', as: :win_page
  get '/pages/lose', to: 'pages#lose', as: :lose_page
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  # get '/players/player_stats', to: 'players#player_stats', as: 'player_stats'

end
