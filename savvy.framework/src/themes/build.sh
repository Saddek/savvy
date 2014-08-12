#!/usr/bin/env bash

themes=../../framework/savvy.framework/themes

rm -rf $themes
mkdir $themes

for theme in */
do
    echo "Compiling $theme..."
    mkdir $themes/$theme
    sass $theme/style.scss $themes/$theme/style.min.css --style compressed
    cp -rf $theme/images $themes/$theme/images
    cp -rf $theme/fonts $themes/$theme/fonts
done