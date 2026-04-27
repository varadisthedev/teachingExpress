### to setup the server

docker run -d --name redis-dev -p 6379:6379 redis:alpine

### verify server si running

docker exec -it redis-dev redis-cli ping

## common docker commands we need

docker stop redis-dev # stop Redis
docker start redis-dev # start it again
docker logs redis-dev # see Redis logs
