#!/usr/bin/env bash

${@:3} 1>$1 2>$2
#$? > $3
