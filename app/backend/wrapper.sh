#!/usr/bin/env bash

exec ${@:3} 1>$1 2>$2
#$? > $3
