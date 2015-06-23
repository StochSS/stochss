#!/usr/bin/env bash

exec ${@:4} 1>$1 2>$2
echo $? > $3
