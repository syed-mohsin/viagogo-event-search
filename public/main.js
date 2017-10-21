var ViaGogoWorld = {};

ViaGogoWorld.generateWorld = function(numEvents, xDim, yDim) {
  var world = {
    xDim: xDim,
    yDim: yDim,
    events: [],
  };

  var worldWidth = (2 * xDim + 1),
      worldHeight = (2 * yDim + 1),
      maxEvents =  worldWidth * worldHeight,
      eventCount = 0,
      eventId = 1,
      seenCoords = new Set();

  console.log(maxEvents, worldWidth, worldHeight);

  // handle case where numEvents is too large
  if (numEvents > maxEvents) {
    numEvents = Math.floor(maxEvents / 2);
  }

  var randXPos, randYPos, seenEvent, event;

  while (eventCount < numEvents) {
    randXPos = Math.floor(Math.random() * worldWidth - xDim);
    randYPos = Math.floor(Math.random() * worldHeight - yDim);

    seenCoord = JSON.stringify(randXPos + ',' + randYPos);

    // do not add another event for seen coordinate pair
    if (seenCoords.has(seenCoord)) {
      continue;
    }

    event = {
      id: eventId++, // increment id
      xPos: randXPos,
      yPos: randYPos,
    };

    world.events.push(event);

    seenCoords.add(seenCoord);
    eventCount++;
  }

  return world;
};

(function() {
  var buttonSelector = '[name=find_tickets]';
  var inputSelector = '[name=coordinates]';

  var numEvents = 99999999;
  var worldXDimension = 10;
  var worldYDimension = 10;

  console.log(ViaGogoWorld.generateWorld(numEvents, worldXDimension, worldYDimension));

  // listener to read input and send to server to be processed
  $(buttonSelector).on('click', function(e) {
    e.preventDefault();

    console.log($(inputSelector).val());
  });
}());
