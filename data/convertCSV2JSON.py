#!/usr/bin/env python
#
#  Name: Bas Katsma
#  Student 10787690
#  Homework - Week 5
#
"""
This script converts CSV to JSON.
"""

import csv
import json
from collections import OrderedDict

if __name__ == "__main__":

    # Initialize the keys
    JSONKeyNames=["GEO", "GEO_TIME", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016"]

    # Create blank array to store the new data in
    dataStorage = []

    # Read data file
    with open("ten00081_Primary_production_of_renewable_energy_WIND.csv", "r", encoding='utf-8-sig') as dataFile:
        dataReader = csv.DictReader(dataFile, JSONKeyNames, delimiter=";")

        # Iterate over each line
        for line in dataReader:

            # Match each value with its corresponding key
            data = OrderedDict()
            for key in JSONKeyNames:

                # Remove whitespace and weird characters
                data[key] = line[key].strip().replace("\ufeff", "")
            dataStorage.append(data)

    # Create new JSON file and use .dump to convert
    with open("ten00081_Primary_production_of_renewable_energy_WIND.json", "w+") as JSONFile:
        json.dump(dataStorage, JSONFile, indent=4)

    # Close all files
    dataFile.close()
    JSONFile.close()
