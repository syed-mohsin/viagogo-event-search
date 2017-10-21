var ViaGogoWorld = {};

ViaGogoWorld.generateWorld = function(numEvents, maxTicketsPerEvent, maxTicketPrice, xDim, yDim) {
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

  var randXPos, randYPos, seenEvent, event, tickets;

  while (eventCount < numEvents) {
    randXPos = this.getRandomNumber(worldWidth, xDim);
    randYPos = this.getRandomNumber(worldHeight, yDim);

    seenCoord = JSON.stringify(randXPos + ',' + randYPos);

    // do not add another event for seen coordinate pair
    if (seenCoords.has(seenCoord)) {
      continue;
    }

    // generate tickets for event
    tickets = this.generateTickets(maxTicketsPerEvent, maxTicketPrice);

    // create event object
    event = {
      id: eventId++, // increment id
      xPos: randXPos,
      yPos: randYPos,
      tickets: tickets,
    };

    world.events.push(event);

    seenCoords.add(seenCoord);
    eventCount++;
  }

  return world;
};

ViaGogoWorld.generateTickets = function(maxTicketsPerEvent, maxTicketPrice) {
  var tickets = [];

  var randomNumTickets = this.getRandomNumber(maxTicketsPerEvent),
      ticket, ticketPrice;

  for (var i=0; i<randomNumTickets; i++) {
    // ticketPrice > 0
    ticketPrice = this.getRandomNumber(maxTicketPrice + 1) + 1;

    ticket = {
      price: ticketPrice
    };

    tickets.push(ticket);
  }

  // sort ticket prices for easier price search O(NlogN)
  tickets.sort(function(a,b) {
    return a.price - b.price;
  });

  return tickets;
};

ViaGogoWorld.getRandomNumber = function(range, offset) {
  return Math.floor(Math.random() * range - (offset || 0));
};

(function() {
  var numEvents = 100,
      worldXDimension = 10,
      worldYDimension = 10,
      maxTicketsPerEvent = 100,
      maxTicketPrice = 300;

  console.log(ViaGogoWorld.generateWorld(numEvents, maxTicketsPerEvent, maxTicketPrice, worldXDimension, worldYDimension));

  var buttonSelector = '[name=find_tickets]',
      inputSelector = '[name=coordinates]';

  // listener to read input and send to server to be processed
  $(buttonSelector).on('click', function(e) {
    e.preventDefault();

    console.log($(inputSelector).val());
  });
}());
