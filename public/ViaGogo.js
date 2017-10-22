var ViaGogo = {};

ViaGogo.generateWorld = function(numEvents, maxTicketsPerEvent, maxTicketPrice, xDim, yDim) {
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

  // handle case where numEvents is too large
  if (numEvents > maxEvents) {
    numEvents = Math.floor(maxEvents / 2);
  }

  var randXPos, randYPos, seenEvent, event, ticketData;

  while (eventCount < numEvents) {
    randXPos = this.getRandomNumber(worldWidth, xDim);
    randYPos = this.getRandomNumber(worldHeight, yDim);

    seenCoord = JSON.stringify(randXPos + ',' + randYPos);

    // do not add another event for seen coordinate pair
    if (seenCoords.has(seenCoord)) {
      continue;
    }

    // generate tickets for event
    ticketData = this.generateTickets(maxTicketsPerEvent, maxTicketPrice);

    // create event object
    event = {
      id: eventId++, // increment id
      xPos: randXPos,
      yPos: randYPos,
      tickets: ticketData.tickets,
      cheapestTicket: ticketData.cheapestTicket
    };

    world.events.push(event);

    seenCoords.add(seenCoord);
    eventCount++;
  }

  return world;
};

ViaGogo.generateTickets = function(maxTicketsPerEvent, maxTicketPrice) {
  var tickets = [];

  var randomNumTickets = this.getRandomNumber(maxTicketsPerEvent),
      ticket, ticketPrice, cheapestTicket;

  for (var i=0; i<randomNumTickets; i++) {
    // ticketPrice > 0
    ticketPrice = this.getRandomNumber(maxTicketPrice + 1) + 1;

    ticket = {
      price: ticketPrice
    };

    // greedily track cheapest ticket
    if (!cheapestTicket || ticket.price < cheapestTicket.price) {
      cheapestTicket = ticket;
    }

    tickets.push(ticket);
  }

  return {
    tickets: tickets,
    cheapestTicket: cheapestTicket,
  };
};

ViaGogo.getRandomNumber = function(range, offset) {
  return Math.floor(Math.random() * range - (offset || 0));
};

ViaGogo.renderNearestEvents = function(listSelector, events, userX, userY) {
  $(listSelector).html('');

  var listElement, distance, event, cheapestPrice;

  for (var i=0; i<5 && i<events.length; i++) {
    event = events[i];

    distance = Math.abs(userX - event.xPos) + Math.abs(userY - event.yPos);
    cheapestPrice = event.cheapestTicket ? event.cheapestTicket.price : '(no tickets)';

    listElement = $('<li></li>');
    listElement.append('Event ' + event.id + ' - ' + '$' + cheapestPrice + ', Distance ' + distance);

    $(listSelector).append(listElement);
  }
};

ViaGogo.renderErrorMessage = function(listSelector) {
  $(listSelector).html('<b>Out of range or invalid input (must be formatted as x,y)</b>');
};

ViaGogo.init = function() {
  var numEvents = 100,
      worldXDimension = 10,
      worldYDimension = 10,
      maxTicketsPerEvent = 100,
      maxTicketPrice = 300;

  var world = ViaGogo.generateWorld(numEvents, maxTicketsPerEvent, maxTicketPrice, worldXDimension, worldYDimension);

  var buttonSelector = '[name=find_tickets]',
      inputSelector = '[name=coordinates]',
      eventsListSelector = '.events_list';

  // listener to read input and send to server to be processed
  $(buttonSelector).on('click', function(e) {
    e.preventDefault();

    var inputCoords = $(inputSelector).val().split(',');

    var userX = parseInt(inputCoords[0]);
    var userY = parseInt(inputCoords[1]);

    // input validation
    if (inputCoords.length !== 2 ||
        Math.abs(userX) > worldXDimension ||
        Math.abs(userY) > worldYDimension) {

        return ViaGogo.renderErrorMessage(eventsListSelector);
    }

    // O(NlogN) sort of events by closest Manhattan distance to input coordinates
    world.events.sort(function(a,b) {
      var distance1 = Math.abs(userX - a.xPos) + Math.abs(userY - a.yPos);
      var distance2 = Math.abs(userX - b.xPos) + Math.abs(userY - b.yPos);

      return distance1 - distance2;
    });

    ViaGogo.renderNearestEvents(eventsListSelector, world.events, userX, userY);
  });
};
