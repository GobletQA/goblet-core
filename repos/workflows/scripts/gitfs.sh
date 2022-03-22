#!/bin/bash

# 
# Install script for gitfs on ubuntu-20
# The default installed via pip uses ubuntu-18 and python3.7
# We need ubuntu-20 and python3.8
# 
# This script clones the forked repo
# Installs needed deps
# Builds gitfs
# Then installs it via pip
# It's also part of the container/Dockerfile, but left it here for reference as well
#

# Install Deps
apt install -qy --no-install-recommends virtualenv python-dev libfuse-dev fuse libffi-dev libgit2-dev python3.8-venv

# Clone the repo
git clone https://github.com/lancetipton/gitfs.git /keg/gitfs

# Build and install gitfs
cd /keg/gitfs
python3 -m pip install --upgrade build
python3 -m build
/usr/bin/pip install ./dist/gitfs-0.5.2-py3-none-any.whl

# Example calling gitfs via python
# mkdir /keg/parkin
# pythongit3 -m gitfs https://github.com/lancetipton/parkin.git /keg/parkin
