"use strict";

const game = require("../../../game.json");
const common = require("../../../helpers/common");
const model = require("../../game_life.js");
const vendors = require("../data/vendors.json");

const vendor = "weapons";

module.exports.doVendorTransaction = function doVendorTransaction(life, transaction) {
	const newLife = JSON.parse(JSON.stringify(life));
	// remove sold mod from stock
	const newMod = newLife.listings.vendors[vendor].stock.splice(transaction.index, 1)[0];
	// take the money from them
	newLife.current.finance.cash -= newMod.price;
	// give them a new weapon
	newLife.current.weapon = {};
	newLife.current.weapon.name = newMod.name;
	newLife.current.weapon.damage = newMod.meta.value;
	// common.log("debug", "* doVendorTransaction:", life);
	return newLife;
};

module.exports.generateVendorListings = function generateVendorListings(life) {
	// generates the prices and units for the vendor
	const listingObj = {
		open: true,
		name: vendors[vendor].name,
		introduction: vendors[vendor].introduction,
		stock: fillStock(life)
	};

	return listingObj;
};

function fillStock(lifeObj) {
	const stockArr = [];
	// make some shorthand versions of props
	const basePrice = game.vendors.base_price * game.vendors[vendor].pricing.times_base;
	const increaseRate = game.vendors[vendor].pricing.increase_rate;
	// TODO: add code to increase the base price as we aquire more storage
	let lastPrice = basePrice;
	let i = 0;
	// add one item for stock count
	while (i < game.vendors[vendor].stock) {
		const stockObj = {
			units: game.vendors[vendor].units,
			name: makeScaryNamedGuns(),
			price: (lastPrice * increaseRate),
			meta: {
				name: "Weapon Damage",
				value: (i + 1) * game.police.base_damage
			}
		};
		lastPrice = stockObj.price;
		stockArr.push(stockObj);
		i++;
	}
	return stockArr;
}

function makeScaryNamedGuns() {
	const scaryMfgs = [
		"Swat and Hissin",
		"Spots and Stripes",
		"Snuggles Co",
		"Mr. Winkles"
	];
	const scaryModels = [
		"P4W",
		"P4W-S",
		"B1T3",
		"CL4W",
		"5-CR4TCH",
		"H1-55",
		"FLUFF",
		"M30W"
	];
	const scaryCalibers = [
		".22 Short",
		".22 Long",
		"5.7x28mm",
		"9mm",
		".38 Special",
		".357 Magnum",
		".45 ACP",
		".50 Caliber"
	];
	const newMfg = common.getRandomInt(0, scaryMfgs.length - 1);
	const newModel = common.getRandomInt(0, scaryModels.length - 1);
	const newCaliber = common.getRandomInt(0, scaryCalibers.length - 1);
	return `${scaryMfgs[newMfg]} ${scaryModels[newModel]} [${scaryCalibers[newCaliber]}]`;
}
