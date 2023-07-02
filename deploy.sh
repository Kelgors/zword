#!/bin/bash -e
rclone sync build/ aws-perso:kelgors-zword/ --verbose
