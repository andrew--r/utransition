var expect = require('chai').expect;
var packageJson = require('../package.json');
var utransition = require(`../build/utransition-${packageJson.version}`).default;


const TICK_DELAY = 16;
let timestamp = Date.now().valueOf();
let invalidTimestamp = Date.now().valueOf();

const timer = (fn) => {
	fn(timestamp += TICK_DELAY);
};

const invalidTimer = (fn) => {
	fn(invalidTimestamp -= TICK_DELAY);
};

describe('utransition', () => {
	describe('invalid usage', () => {
		it('should throw a TypeError when duration is not presented', () => {
			expect(() => utransition()).to.throw(TypeError);
		});

		it('should throw a RangeError when duration is a negative number', () => {
			expect(() => utransition(-10)).to.throw(RangeError);
		});

		it('should throw a RangeError when duration is zero', () => {
			expect(() => utransition(0)).to.throw(RangeError);
		});

		it('should throw a TypeError if timer is not passed', () => {
			expect(() => utransition(1)).to.throw(TypeError);
		});

		it('should throw an Error when custom timer is not passing timestamp to tick handler', () => {
			expect(() => {
				const transition = utransition(1, (fn) => fn());
				transition.start();
			}).to.throw(Error);
		});

		it('should throw an Error when custom timer is passing incorrect timestamp values', () => {
			expect(() => {
				const transition = utransition(1, invalidTimer);
				transition.start();
			}).to.throw(Error);
		});

		it('should not override start() method', () => {
			const transition = utransition(1, timer);
			let flag = 0;

			transition.start = () => { // should have no effect
				flag = 1;
			};

			expect(flag).to.be.equal(0);
			transition.start();
			expect(flag).to.be.equal(0);
		});

		it('should not override abort() method', () => {
			const progressHistory = [];
			let abort;

			const transition = utransition(TICK_DELAY * 5, timer);
			transition.onProgress = function (progress) {
				progressHistory.push(progress);

				if (progress === 0.4) {
					transition.abort();
				}
			};
			transition.abort = function () {}; // should have no effect

			expect(progressHistory).to.deep.equal([]);
			transition.start();
			expect(progressHistory).to.deep.equal([0, 0.2, 0.4]);
		});
	});

	describe('behaviour', () => {
		it('should return an object with API methods', () => {
			const transition = utransition(200, timer);

			expect(transition).to.be.an('object');
			expect(transition.start).to.be.a('function');
			expect(transition.abort).to.be.a('function');
		});

		it('should start transition after start() call', () => {
			let started = false;

			const transition = utransition(200, timer);
			transition.onStart = function () {
				started = true;
			};

			expect(started).to.be.false;
			transition.start();
			expect(started).to.be.true;
		});

		it('should correctly calculate eased progress and linear progress', () => {
			const progressHistory = [];

			const transition = utransition(TICK_DELAY * 5, timer, (p) => p * 2);
			transition.onProgress = function (easedProgress, progress) {
				progressHistory.push([progress, easedProgress]);
			};

			expect(progressHistory).to.deep.equal([]);
			transition.start();
			expect(progressHistory).to.deep.equal([
				[0, 0],
				[0.2, 0.4],
				[0.4, 0.8],
				[0.6, 1.2],
				[0.8, 1.6],
				[1, 2],
			]);
		});

		it('should abort transition after abort() call', () => {
			const progressHistory = [];
			let abort;

			const transition = utransition(TICK_DELAY * 5, timer);
			transition.onProgress = function (progress) {
				progressHistory.push(progress);

				if (progress === 0.4) {
					transition.abort(); // or this.abort()
				}
			};

			expect(progressHistory).to.deep.equal([]);
			transition.start();
			expect(progressHistory).to.deep.equal([0, 0.2, 0.4]);
		});



		it('should invoke onEnd function when transition ended', () => {
			let ended = false;

			const transition = utransition(200, timer);
			transition.onEnd = function () {
				ended = true;
			};

			expect(ended).to.be.false;
			transition.start();
			expect(ended).to.be.true;
		});
	});
});
