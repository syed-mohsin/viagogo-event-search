var ViaGogo = {};

/**
 * generates a 'world' object with a bounded x and y and specified number of events
 * @param {number} numEvents
 * @param {number} maxTicketsPerEvent
 * @param {number} maxTicketPrice
 * @param {number} xDim
 * @param {number} yDim
 * @return {object[]}
 */
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

/**
 * Generate a random length array of tickets in range [0, maxTicketsPerEvent]
 * @param {number} maxTicketsPerEvent
 * @param {number} maxTicketPrice
 * @return {object}
 */
ViaGogo.generateTickets = function(maxTicketsPerEvent, maxTicketPrice) {
  var tickets = [];

  var randomNumTickets = this.getRandomNumber(maxTicketsPerEvent),
      ticket, ticketPrice, cheapestTicket;

  for (var i=0; i<randomNumTickets; i++) {
    // ticketPrice > 0
    ticketPrice = this.getRandomNumber((maxTicketPrice + 1) * 100) + 1;

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

/**
 * Return a random number between [offset - (range + offset)]
 * @param {number} range
 * @param {number} offset
 * @return {number}
 */
ViaGogo.getRandomNumber = function(range, offset) {
  return Math.floor(Math.random() * range - (offset || 0));
};

/**
 * render the nearest 5 events on the web page using jQuery
 * @param {string} listSelector
 * @param {object[]} events
 * @param {number} userX
 * @param {number} userY
 */
ViaGogo.renderNearestEvents = function(listSelector, events, userX, userY) {
  $(listSelector).html('');

  var EVENTS_TO_SHOW = 5;

  var listElement, distance, event, cheapestPrice,
      eventOutput, priceOutput, distanceOutput;

  for (var i=0; i<EVENTS_TO_SHOW && i<events.length; i++) {
    event = events[i];

    distance = Math.abs(userX - event.xPos) + Math.abs(userY - event.yPos);
    cheapestPrice = event.cheapestTicket ? (event.cheapestTicket.price / 100).toFixed(2) : '(no tickets)';

    eventOutput = 'Event ' + event.id;
    priceOutput = '$' + cheapestPrice;
    distanceOutput = 'Distance ' + distance + ' (' + event.xPos + ', ' + event.yPos + ')';

    listElement = $('<li></li>');
    listElement.append(eventOutput + ' - ' + priceOutput + ', ' + distanceOutput);

    $(listSelector).append(listElement);
  }
};

/**
 * render the default error message using jQuery
 * @param {string} listSelector
 */
ViaGogo.renderErrorMessage = function(listSelector) {
  $(listSelector).html('<b>Out of range or invalid input (must be formatted as x,y)</b>');
};

/**
 * Intiialize the world with default inputs.
 * Initialize listener for user input submission.
 */
ViaGogo.init = function() {
  var NUM_EVENTS = 100,
      WORLD_X_DIMENSION = 10,
      WORLD_Y_DIMENSION = 10,
      MAX_TICKETS_PER_EVENT = 100,
      MAX_TICKET_PRICE = 300;

  var world = ViaGogo.generateWorld(
    NUM_EVENTS,
    MAX_TICKETS_PER_EVENT,
    MAX_TICKET_PRICE,
    WORLD_X_DIMENSION,
    WORLD_Y_DIMENSION
  );

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
        Math.abs(userX) > WORLD_X_DIMENSION ||
        Math.abs(userY) > WORLD_Y_DIMENSION) {

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
