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
    with open("total.csv", "r", encoding='utf-8-sig') as dataFile:
        dataReader = csv.DictReader(dataFile, JSONKeyNames, delimiter=";")
        next(dataReader)

        # Iterate over each row
        for row in dataReader:

            # Match each value with its corresponding key
            data = OrderedDict()

            data["GEO"] = row["GEO"]
            data["GEO_TIME"] = row["GEO_TIME"]

            values = []

            for year in JSONKeyNames[2:]:

                values.append({"year": int(year), "production": float(row[year])})

            data["values"] = values
            dataStorage.append(data)

    # Create new JSON file and use .dump to convert
    with open("test.json", "w+") as JSONFile:
        json.dump(dataStorage, JSONFile, indent=4)

    # Close all files
    dataFile.close()
    JSONFile.close()
