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
    @daily path/to/bin/get-stock.py ORCL > path/to/public/current.json

    # another example (refresh 4 times a day)
    0 */6 * * * path/to/bin/get-stock.py ORCL > path/to/public/current.json

    # symlink apache or whatever to public/ directory
