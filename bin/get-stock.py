#!/usr/bin/python3

#
# get-stock.py: fetch current stock ticker information and write it to
# as JSON to standard output.
#
# Usage:
#
#   # fetch current google price and write it to current.json
#   get-stock.py GOOG > current.json
#

import sys
import json
import yfinance

# check command-line arguments
if len(sys.argv) < 2:
  raise RuntimeError('missing code')

# get ticker info, convert to json, print to stdout
print(json.dumps(yfinance.Ticker(sys.argv[1]).info))
