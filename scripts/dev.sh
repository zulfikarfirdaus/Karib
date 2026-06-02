#!/bin/sh
./node_modules/.bin/next dev --turbopack &
pid=$!
sleep 3
until curl -s -o /dev/null http://localhost:3000 2>/dev/null; do sleep 1; done
open http://localhost:3000
wait $pid
