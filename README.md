= Alonzo Mood Calculator

Calculate Alonzo's likely mood for the day.

== Installation

Setup instructions (Debian):

    # install yfinance
    sudo pip3 install yfinance

    # run bin/get-stock.py once to get the current prices
    bin/get-stock.py ORCL > public/current.json
    
    # set up cron job that calls bin/get-stock.py daily
    # example:
    @daily bin/get-stock.py ORCL > public/current.json

    # symlink apache or whatever to public/ directory
