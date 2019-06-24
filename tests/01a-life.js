"use strict";

const expect = require("chai").expect;

const main = require("./00-main");
const config = main.config;
const common = main.common;
const model = main.model;

let life;

describe("Life Model - Base Validation", () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;
	});

	it("life should not be undefined", (done) => {
		expect(life).to.not.be.an("undefined");
		return done();
	});

	it("life should have required properties", (done) => {
		expect(life).to.be.an("object");
		expect(life).to.have.property("_id");
		expect(life).to.have.property("alive");
		expect(life).to.have.property("starting");
		expect(life).to.have.property("current");
		expect(life).to.have.property("listings");
		expect(life).to.have.property("actions");
		return done();
	});

	it("life should have a valid id", (done) => {
		expect(life._id).to.be.a("string");
		const idArr = life._id.split("_");
		expect(idArr.length).to.equal(2);
		expect(idArr[0]).to.equal(config.PLAYER._id);
		// TODO: expect().to.be.a.timestamp?
		return done();
	});

	it("life should be alive", (done) => {
		expect(life.alive).to.be.a("boolean");
		expect(life.alive).to.equal(true);
		return done();
	});
});

describe("Life Model - Starting Validation", () => {
	it("starting life should have required properties", (done) => {
		expect(life.starting).to.be.an("object");
		expect(life.starting).to.have.property("turn");
		expect(life.starting).to.have.property("event");
		expect(life.starting).to.have.property("police");
		expect(life.starting).to.have.property("hotel");
		expect(life.starting).to.have.property("finance");
		expect(life.starting).to.have.property("health");
		expect(life.starting).to.have.property("inventory");
		expect(life.starting).to.have.property("location");
		expect(life.starting).to.have.property("storage");
		return done();
	});

	it("starting life should have a valid turn", (done) => {
		expect(life.starting.turn).to.be.a("number");
		return done();
	});

	it("starting life should have a valid event", (done) => {
		expect(life.starting.event).to.be.a("string");
		return done();
	});

	it("starting life should have a valid police object", (done) => {
		expect(life.starting.police).to.be.an("object");
		expect(life.starting.police).to.have.property("heat");
		expect(life.starting.police).to.have.property("rate");
		expect(life.starting.police).to.have.property("awareness");
		expect(life.starting.police).to.have.property("encounter");
		expect(life.starting.police).to.have.property("history");
		return done();
	});

	it("starting life should have a hotel flag", (done) => {
		expect(life.starting.hotel).to.be.a("boolean");
		return done();
	});

	it("starting life should have a valid finance object", (done) => {
		expect(life.starting.finance).to.be.an("object");
		// cash
		expect(life.starting.finance).to.have.property("cash");
		expect(life.starting.finance.cash).to.be.a("number");
		expect(life.starting.finance.cash).to.be.at.least(0);
		expect(common.isWholeNumber(life.starting.finance.cash)).to.be.true;
		// debt
		expect(life.starting.finance).to.have.property("debt");
		expect(life.starting.finance.debt).to.be.a("number");
		expect(life.starting.finance.debt).to.be.at.least(0);
		expect(common.isWholeNumber(life.starting.finance.debt)).to.be.true;
		// savings
		expect(life.starting.finance).to.have.property("savings");
		expect(life.starting.finance.savings).to.be.a("number");
		expect(life.starting.finance.savings).to.be.at.least(0);
		expect(common.isWholeNumber(life.starting.finance.savings)).to.be.true;
		// debt interest
		expect(life.starting.finance).to.have.property("debt_interest");
		expect(life.starting.finance.debt_interest).to.be.a("number");
		expect(life.starting.finance.debt_interest).to.be.at.least(0);
		// savings interest
		expect(life.starting.finance).to.have.property("savings_interest");
		expect(life.starting.finance.savings_interest).to.be.a("number");
		expect(life.starting.finance.savings_interest).to.be.at.least(0);
		return done();
	});

	it("starting life should have a valid health object", (done) => {
		expect(life.starting.health).to.be.an("object");
		expect(life.starting.health).to.have.property("points");
		expect(life.starting.health.points).to.be.a("number");
		expect(life.starting.health.points).to.be.above(0);
		expect(common.isWholeNumber(life.starting.health.points)).to.be.true;
		expect(life.starting.health.points).to.equal(config.GAME.person.starting_hp);
		expect(life.starting.health).to.have.property("max");
		expect(life.starting.health.max).to.be.a("number");
		expect(life.starting.health.max).to.be.above(0);
		expect(common.isWholeNumber(life.starting.health.max)).to.be.true;
		expect(life.starting.health.max).to.equal(config.GAME.person.max_hp);
		expect(life.starting.health).to.have.property("status");
		return done();
	});

	it("starting life should have a valid inventory array", (done) => {
		expect(life.starting.inventory).to.be.an("array");
		return done();
	});

	it("starting life should have a valid location object", (done) => {
		expect(life.starting.location).to.be.an("object");
		// city
		expect(life.starting.location).to.have.property("city");
		expect(life.starting.location.city).to.be.a("string");
		expect(life.starting.location.city).to.equal(config.LOCATION.location.city);
		// country
		expect(life.starting.location).to.have.property("country");
		expect(life.starting.location.country).to.be.a("string");
		expect(life.starting.location.country).to.equal(config.LOCATION.location.country);
		// continent
		expect(life.starting.location).to.have.property("continent");
		expect(life.starting.location.continent).to.be.a("string");
		expect(life.starting.location.continent).to.equal(config.LOCATION.location.continent);
		// ID
		expect(life.starting.location).to.have.property("id");
		expect(life.starting.location.id).to.be.a("string");
		expect(life.starting.location.id).to.equal(config.LOCATION.location.id);
		// size
		expect(life.starting.location).to.have.property("size");
		expect(life.starting.location.size).to.be.a("number");
		expect(life.starting.location.size).to.be.at.least(0);
		expect(life.starting.location.size).to.equal(config.LOCATION.location.size);
		return done();
	});

	it("starting life should have a valid storage object", (done) => {
		expect(life.starting.storage).to.be.an("object");
		// available
		expect(life.starting.storage).to.have.property("available");
		expect(life.starting.storage.available).to.be.a("number");
		expect(life.starting.storage.available).to.be.at.least(0);
		expect(common.isWholeNumber(life.starting.storage.available)).to.be.true;
		// total
		expect(life.starting.storage).to.have.property("total");
		expect(life.starting.storage.total).to.be.a("number");
		expect(life.starting.storage.total).to.be.at.least(0);
		expect(common.isWholeNumber(life.starting.storage.total)).to.be.true;
		// make sure total is > than available always
		expect(life.starting.storage.total).to.be.at.least(life.starting.storage.available);
		return done();
	});
});

describe("Life Model - Current Validation", () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;
	});

	it("current life should have required properties", (done) => {
		expect(life.current).to.be.an("object");
		expect(life.current).to.have.property("turn");
		expect(life.current).to.have.property("event");
		expect(life.current).to.have.property("police");
		expect(life.current).to.have.property("hotel");
		expect(life.current).to.have.property("finance");
		expect(life.current).to.have.property("health");
		expect(life.current).to.have.property("inventory");
		expect(life.current).to.have.property("location");
		expect(life.current).to.have.property("storage");
		return done();
	});

	it("current life should have a valid turn", (done) => {
		expect(life.current.turn).to.be.a("number");
		return done();
	});

	it("current life should have a valid event", (done) => {
		expect(life.current.event).to.be.a("string");
		return done();
	});

	it("current life should have a valid police object", (done) => {
		expect(life.current.police).to.be.an("object");
		expect(life.current.police).to.have.property("heat");
		expect(life.current.police).to.have.property("rate");
		expect(life.current.police).to.have.property("awareness");
		expect(life.current.police).to.have.property("encounter");
		expect(life.current.police).to.have.property("history");
		return done();
	});

	it("current life should have a hotel flag", (done) => {
		expect(life.current.hotel).to.be.a("boolean");
		return done();
	});

	it("current life should have a valid finance object", (done) => {
		expect(life.current.finance).to.be.an("object");
		// cash
		expect(life.current.finance).to.have.property("cash");
		expect(life.current.finance.cash).to.be.a("number");
		expect(life.current.finance.cash).to.be.at.least(0);
		expect(common.isWholeNumber(life.current.finance.cash)).to.be.true;
		// debt
		expect(life.current.finance).to.have.property("debt");
		expect(life.current.finance.debt).to.be.a("number");
		expect(life.current.finance.debt).to.be.at.least(0);
		expect(common.isWholeNumber(life.current.finance.debt)).to.be.true;
		// savings
		expect(life.current.finance).to.have.property("savings");
		expect(life.current.finance.savings).to.be.a("number");
		expect(life.current.finance.savings).to.be.at.least(0);
		expect(common.isWholeNumber(life.current.finance.savings)).to.be.true;
		// debt interest
		expect(life.current.finance).to.have.property("debt_interest");
		expect(life.current.finance.debt_interest).to.be.a("number");
		expect(life.current.finance.debt_interest).to.be.at.least(0);
		// savings interest
		expect(life.current.finance).to.have.property("savings_interest");
		expect(life.current.finance.savings_interest).to.be.a("number");
		expect(life.current.finance.savings_interest).to.be.at.least(0);
		return done();
	});

	it("current life should have a valid health object", (done) => {
		expect(life.current.health).to.be.an("object");
		expect(life.current.health).to.have.property("points");
		expect(life.current.health.points).to.be.a("number");
		expect(life.current.health.points).to.be.above(0);
		expect(common.isWholeNumber(life.current.health.points)).to.be.true;
		expect(life.current.health).to.have.property("status");
		return done();
	});

	it("current life should have a valid inventory array", (done) => {
		expect(life.current.inventory).to.be.an("array");
		return done();
	});

	it("current life should have a valid location object", (done) => {
		expect(life.current.location).to.be.an("object");
		// city
		expect(life.current.location).to.have.property("city");
		expect(life.current.location.city).to.be.a("string");
		expect(life.current.location.city).to.equal(config.LOCATION.location.city);
		// country
		expect(life.current.location).to.have.property("country");
		expect(life.current.location.country).to.be.a("string");
		expect(life.current.location.country).to.equal(config.LOCATION.location.country);
		// continent
		expect(life.current.location).to.have.property("continent");
		expect(life.current.location.continent).to.be.a("string");
		expect(life.current.location.continent).to.equal(config.LOCATION.location.continent);
		// ID
		expect(life.current.location).to.have.property("id");
		expect(life.current.location.id).to.be.a("string");
		expect(life.current.location.id).to.equal(config.LOCATION.location.id);
		// size
		expect(life.current.location).to.have.property("size");
		expect(life.current.location.size).to.be.a("number");
		expect(life.current.location.size).to.be.at.least(0);
		expect(life.current.location.size).to.equal(config.LOCATION.location.size);
		return done();
	});

	it("current life should have a valid storage object", (done) => {
		expect(life.current.storage).to.be.an("object");
		// available
		expect(life.current.storage).to.have.property("available");
		expect(life.current.storage.available).to.be.a("number");
		expect(life.current.storage.available).to.be.at.least(0);
		expect(common.isWholeNumber(life.current.storage.available)).to.be.true;
		// total
		expect(life.current.storage).to.have.property("total");
		expect(life.current.storage.total).to.be.a("number");
		expect(life.current.storage.total).to.be.at.least(0);
		expect(common.isWholeNumber(life.current.storage.total)).to.be.true;
		// make sure total is > than available always
		expect(life.current.storage.total).to.be.at.least(life.current.storage.available);
		return done();
	});
});

describe("Life Model - Listing Validation", () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;
	});

	it("listing should have required properties", (done) => {
		expect(life.listings).to.be.an("object");
		expect(life.listings).to.have.property("market");
		expect(life.listings).to.have.property("airport");
		return done();
	});

	it("listing should have a valid market array", (done) => {
		expect(life.listings.market).to.be.an("array");
		return done();
	});

	it("listing should have a valid airport array", (done) => {
		expect(life.listings.market).to.be.an("array");
		return done();
	});
});

describe("Life Model - Actions Validation", () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;
	});

	it("actions should be an array", (done) => {
		expect(life.actions).to.be.an("array");
		return done();
	});

	it("actions should be empty", (done) => {
		expect(life.actions.length).to.equal(1);
		return done();
	});

	it("actions should have turn 0 airport action", (done) => {
		expect(life.actions[0].turn).to.equal(0);
		expect(life.actions[0].type).to.equal("airport");
		expect(life.actions[0].data).to.deep.equal(life.current.location);
		return done();
	});
});
