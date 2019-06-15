"use strict";

const game = require("../../game.json");
const itemsJSON = require("./data/items.json");
const eventsJSON = require("./data/events.json");
const common = require("../../helpers/common");
const model = require("../game_life.js");
const localization = require("./data/localization");

module.exports.doSimulateEvents = function doSimulateEvents(life) {
	let newLife = JSON.parse(JSON.stringify(life));
	// see if we even get an event
	const roll = common.rollDice(0, 1, life.current.event_meta);
	// see if our roll is good enough for an event
	if (game.events.event_rate <= roll || life.testing === true) {
		// they didn't get an event
		newLife.current.event = localization("event_no_event");
		return newLife;
	}
	// pick a random number from the events
	const eventIndex = common.getRandomInt(0, (eventsJSON.length - 1));
	const eventObj = eventsJSON[eventIndex];
	newLife = module.exports.simulateEvents(newLife, eventObj);
	return newLife;
};

module.exports.simulateEvents = function simulateEvents(life, eventObj) {
	let newLife = JSON.parse(JSON.stringify(life));
	const newListing = newLife.listings.market;
	// see what kind of event this is
	let adjustment;
	switch (eventObj.type) {

	case "adjust_market":
		// start building the adjustment object
		adjustment = {
			type: eventObj.type,
			item: newListing[common.getRandomInt(0, (newListing.length - 1))],
			price: common.getRandomArbitrary(eventObj.parameters.price.min, eventObj.parameters.price.max),
			units: common.getRandomArbitrary(eventObj.parameters.units.min, eventObj.parameters.units.max)
		};
		newLife = adjustMarketListing(newLife, adjustment);
		break;
	case "adjust_inventory":
		// start building the adjustment object
		adjustment = {
			type: eventObj.type,
			item: newListing[common.getRandomInt(0, (newListing.length - 1))],
			units: common.getRandomArbitrary(eventObj.parameters.units.min, eventObj.parameters.units.max)
		};
		newLife = adjustCurrentInventory(newLife, adjustment);
		break;
	case "adjust_cash":
		// start building the adjustment object
		adjustment = {
			type: eventObj.type,
			amount: common.getRandomArbitrary(eventObj.parameters.amount.min, eventObj.parameters.amount.max)
		};
		newLife = adjustCurrentCash(newLife, adjustment);
		break;
	}
	// write the description
	newLife.current.event = makeDescription(eventObj, adjustment);
	// wipe meta
	if (newLife.current.event_meta) {
		delete newLife.current.event_meta;
	}
	// write the actions log
	newLife.actions.push({
		turn: newLife.current.turn,
		type: "event",
		data: adjustment
	});
	// common.log("debug", "* simulateEvents:", newLife);
	return newLife;
};

function makeDescription(eventObj, adjustment) {
	// pick description
	let description = eventObj.descriptions[common.getRandomInt(0, (eventObj.descriptions.length - 1))];
	if (description.indexOf("{{item}}") >= 0) {
		description = description.replace(/\{\{item\}\}/g, adjustment.item.name);
	}
	if (description.indexOf("{{amount}}") >= 0) {
		description = description.replace(/\{\{amount\}\}/g, Math.round(adjustment.amount * game.market.base_price));
	}
	return description;
}

function adjustMarketListing(life, adjustment) {
	const newLife = JSON.parse(JSON.stringify(life));
	// get the listing
	const listing = common.getObjFromID(adjustment.item.id, newLife.listings.market);
	// adjust the listing's stock
	listing.units = Math.round(listing.units * adjustment.units);
	// adjust the listing's price
	listing.price = Math.round(listing.price * adjustment.price);
	// insert it back into the listings
	newLife.listings.market = common.replaceObjFromArr(listing, newLife.listings.market);
	return newLife;
}

function adjustCurrentInventory(life, adjustment) {
	const newLife = JSON.parse(JSON.stringify(life));
	// get the inventory
	let inventory = common.getObjFromID(adjustment.item.id, newLife.current.inventory);
	if (inventory === false) {
		// we searched the inventory for this object, but didn't find it, lets make it
		inventory = {
			id: adjustment.item.id,
			units: 0
		};
		newLife.current.inventory.push(inventory);
	}
	const newUnits = Math.round(game.market.base_units * adjustment.units);
	if (newUnits <= newLife.current.storage.available) {
		// adjust the listing's stock
		inventory.units += newUnits;
		// adjust the storage
		newLife.current.storage.available -= newUnits;
		// insert it back into the inventory
		newLife.current.inventory = common.replaceObjFromArr(inventory, newLife.current.inventory);
	} else {
		// they don't have enough available storage
		newLife.actions.push({
			turn: newLife.current.turn,
			type: "event - failed (storage)",
			data: adjustment
		});
	}
	return newLife;
}

function adjustCurrentCash(life, adjustment) {
	const newLife = JSON.parse(JSON.stringify(life));
	// adjust the user's cash
	newLife.current.finance.cash += Math.round(adjustment.amount * game.market.base_price);
	return newLife;
}
