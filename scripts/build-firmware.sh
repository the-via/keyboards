#!/bin/bash

build_dir=$(pwd)

# Make sure qmk is installed
git -C ~/qmk git pull || git clone https://github.com/qmk/qmk_firmware.git ~/qmk
cd ~/qmk
cat $build_dir/QMK_REVISION | xargs -n 1 git checkout
util/qmk_install.sh
make git-submodule

make all:via

# copy hex and bin files to dist/firmware
target_dir="$build_dir/dist/firmware"
mkdir -p $target_dir
find -maxdepth 1 -regex '.*\.\(hex\|bin\)' -exec mv -f {} $target_dir \;
