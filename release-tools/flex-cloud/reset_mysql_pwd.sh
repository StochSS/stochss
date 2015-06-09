#!/usr/bin/env bash

# Script for reseting MySQL password for an existing MySQL username with given new password
# It needs to run locally on machine running the MySQL service

function print_help {
    echo "usage: $0 <username> <new_password> [-h|--help]"
}

if [[ $# -eq 1 && ( $1 = '-h' || $1 = '--help' ) ]]; then
    print_help
    exit
elif [ $# -ne 2 ]; then
    echo 'Please pass MySQL username and new password!'
    print_help
    exit
fi

username=$1
password=$2


# Kill any mysql processes currently running
service mysql stop
killall -vw mysqld

# Start mysql in safe mode, skipping grant tables
mysqld_safe --skip-grant-tables >res 2>&1 &

# hack for successful mysql connection
sleep 5

# Update password
mysql mysql -e "UPDATE user SET Password=PASSWORD('$password') WHERE User='$username';FLUSH PRIVILEGES;"

# Kill the insecure mysql process
killall -v mysqld

# Restarting mysql again
service mysql restart

echo 'Password reset successful!'
