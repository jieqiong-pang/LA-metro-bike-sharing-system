# Data Process
In this folder, we store the raw data, processed data, and data-processing program.

## Folder
- `./rawdata` - store the raw data, including raw metro bike activity data and raw metro bike station data
- `./processed_data` - store the processed data which can be used for the project
- `data_processing.ipynb` - data processing program
- `data_process_utility.py` -  data processing utility library

## Bike Activity Data Processing Flow
For the raw bike activity data in each file (each quater):
1. Rename the columns which have different names compared to the column information provided by the data source website.
2. Remove rows whose start_station or end_station are 3000 (a "Virtual Station" which is used by staff to check in or check out a bike ).
3. Remove rows which have null location information.
4. Change start_time and end_time format to `"%m/%d/%Y %H:%M"` if necessary.

## Bike Station Data Processing Flow
1. Delete virtual station 3000.
2. Collect stations' latitude and longtitude from metro bike activity files.
3. Inner join stations' latitude and longtitude with station information on station id.