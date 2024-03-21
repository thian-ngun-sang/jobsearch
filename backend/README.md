database
--------
sudo apt-get install mysql-server -> if mysql is not installed yet


php set up
----------
sudo add-apt-repository ppa:ondrej/php
sudo apt install software-properties-common
sudo apt install php8.2
sudo apt-get install php8.2-xml
# sudo apt install php-cli
# sudo apt-get install php8.1-xml
php --version


install composer & php-mysql(driver)
------------------------------------
sudo apt-get install composer
sudo apt-get install php-mysql
php artisan migrate


prepare project
---------------
"sudo composer install" or
"composer install --ignore-platform-reqs" or
"sudo composer --ignore-platform-req=ext-curl install"(recommended) =>
        install necessary packages for the project

"composer update --ignore-platform-reqs" or
"sudo composer update" or
"sudo composer --ignore-platform-req=ext-curl update" =>
        update packages
        # - if something went wrong remove 'vendor" directory
        #       and run "sudo composer --ignore-platform-req=ext-curl install"

php artisan key:generate
php artisan storage:link =>
        if you want to use local storage
        # - if there is 'storage' link inside 'public' directory already exists
        #       delete it, rerun this command


php artisan --host={private-ip-address} serve
