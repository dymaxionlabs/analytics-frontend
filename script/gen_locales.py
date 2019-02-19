#!/usr/bin/env python3
import csv
import json
import os
import shutil

BASE_LOCALE_PATH = os.path.join('static', 'locales')

data = {}
all_locales = []

with open('i18n.csv') as csvfile:
    reader = csv.DictReader(csvfile)

    is_first_row = True
    for row in reader:
        if not row['namespace']:
            continue

        if is_first_row:
            locale_keys = list(sorted(set(row.keys()) - set(['namespace', 'key'])))
            all_locales = [lc.lower() for lc in locale_keys if lc]
            for locale in all_locales:
                data[locale] = {}
            is_first_row = False

        ns = row['namespace']
        key = row['key']

        for locale in all_locales:
            data_local = data[locale]
            if ns not in data_local:
                data_local[ns] = {}
            data_local[ns][key] = row[locale]

shutil.rmtree(BASE_LOCALE_PATH)
for locale, locale_data in data.items():
    for ns, ns_data in locale_data.items():
        locale_path = os.path.join(BASE_LOCALE_PATH, locale)
        fname = '{}.json'.format(ns)
        outpath = os.path.join(locale_path, fname)

        os.makedirs(os.path.dirname(outpath), exist_ok=True)
        with open(outpath, 'w') as outfile:
            json.dump(ns_data, outfile, sort_keys=True, indent=2)
        print(outpath, 'written')
