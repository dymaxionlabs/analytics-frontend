#!/bin/bash
I18N_ID=1AmrxI25tSvKnkbbd4uknAvy_--llcFCaYcd7b_YEegk
#wget "https://docs.google.com/spreadsheets/d/${I18N_ID}/export?format=csv&id=${I18N_ID}&gid=0" -O i18n.csv
wget "https://docs.google.com/spreadsheets/d/${I18N_ID}/export?format=csv" -O i18n.csv
script/gen_locales.py
git add i18n.csv static/locales
