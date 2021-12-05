#!/bin/bash

username=$1
host=$2

rsync -a ./packages/server/package* ./packages/server/env ./packages/server/secret ./packages/server/dist ${username}@${host}:/var/www/html/apps/inkvisitor-stage/server 
rsync -a ./packages/server/src/service/emails ${username}@${host}:/var/www/html/apps/inkvisitor-stage/server/dist/server/src/service

ssh ${username}@${host} 'cd /var/www/html/apps/inkvisitor-stage/server && npm install && npm run restart:stage'
