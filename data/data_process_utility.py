import time
import pandas as pd


def is_time_format(ts, tf):
    # ts - time string, like "2017-12-30 10:20:00"
    # tf - time string format, like "%Y-%m-%d %H:%M:%S"
    try:
        time.strptime(ts, tf)
        return True
    except ValueError:
        return False


def change_time_format(ts, tf_i, tf_o):
    try:
        t_in = time.strptime(ts, tf_i)
        ts_out = time.strftime(tf_o, t_in)
        return ts_out
    except ValueError:
        return ts

def df_has_nan(dataframe):
    return dataframe.isnull().any()