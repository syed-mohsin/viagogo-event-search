# ViaGogo Challenge

## Test Live
https://viagogo-event-search.herokuapp.com/

## Requirements
```
node >= v5.0.0
npm >= v3.0.0
```

## Install
```
npm install
```

## Run locally at http://localhost:3000
```
npm start
```

## Assumptions
1) In order to regenerate seed data, reload the web page

2) Default number of seed events generated on page load: <b>100</b> (configurable)

3) Default maximum number of tickets generated per event: <b>100</b> (configurable)

4) Default maximum ticket price: <b>300</b> (configurable)

5) The world is represented by a cartesian plane which ranges from -10 to +10 (Y axis), and -10
to +10 (X axis). This is also configurable.

6) User input must be formatted as x,y where x and y are integers within the bounds of the world

7) An event is considered 'nearest' if its Manhattan distance is 0 and will be shown in output

8) Event IDs are integers that start at 1 and increment as each event is created (e.g. 1, 2, 3, ...)

## Follow Up
1) To support multiple events at the same location, remove the hash set used to check if a specific coordinate has already been mapped to an event 
```
// remove this (ViaGogo.js - ViaGogo.generateWorld())
  if (seenCoords.has(seenCoord)) {
    continue;
  }
```

2) With a much larger world, I would not sort all events by minimum manhattan distance from the user input coordinates. Instead, I would group all events by coordinates and do a bread-first search of all adjacent coordinates until the 5 nearest events are located. BFS guarantees that all traversed nodes are accessed in order of shortest distance. This would bring the O-Complexity run time of finding the nearest 5 events down from O(NlogN) to O(N) (worst case) where N = |events| 
    
