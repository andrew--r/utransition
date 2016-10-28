var expect = require('chai').expect;
var packageJson = require('../package.json');
var utransition = require(`../build/utransition-${packageJson.version}`).default;


const FRAME_DELAY = 16;
let timer = Date.now().valueOf();

// emulate requestAnimationFrame just to test calculations
global.requestAnimationFrame = (fn) => {
	fn(timer += FRAME_DELAY);
};

describe('utransition', () => {
	describe('invalid parameters handling', () => {
		it('should throw a TypeError when duration is not presented', () => {
			expect(() => utransition()).to.throw(TypeError);
		});

		it('should throw a RangeError when duration is a negative number', () => {
			expect(() => utransition(-10)).to.throw(RangeError);
		});

		it('should throw a RangeError when duration is zero', () => {
			expect(() => utransition(0)).to.throw(RangeError);
		});
	});

	describe('behaviour', () => {
		it('should return a function that starts transition', () => {
			let started = false;

			const start = utransition(200, {
				onStart: () => {
					started = true;
				},
			});

			expect(start).to.be.a('function');
			expect(started).to.be.false;
			start();
			expect(started).to.be.true;
		});

		it('should correctly calculate eased progress and linear progress', () => {
			const progressHistory = [];

			const start = utransition(FRAME_DELAY * 5, {
				onFrame(easedProgress, progress) {
					progressHistory.push([progress, easedProgress]);
				},
				easing(progress) {
					return progress * 2;
				},
			});

			expect(progressHistory).to.deep.equal([]);
			start();
			expect(progressHistory).to.deep.equal([
				[0, 0],
				[0.2, 0.4],
				[0.4, 0.8],
				[0.6, 1.2],
				[0.8, 1.6],
				[1, 2],
			]);
		});

		it('start function should return function that aborts transition', () => {
			const progressHistory = [];
			let abort;

			const start = utransition(FRAME_DELAY * 5, {
				onFrame(progress, linear, abort) {
					progressHistory.push(progress);

					if (progress === 0.4) {
						abort();
					}
				},
			});

			expect(progressHistory).to.deep.equal([]);
			abort = start();
			expect(progressHistory).to.deep.equal([0, 0.2, 0.4]);
		});

		it('should invoke onEnd function when transition ended', () => {
			let ended = false;

			const start = utransition(200, {
				onEnd: () => {
					ended = true;
				},
			});

			expect(ended).to.be.false;
			start();
			expect(ended).to.be.true;
		});
	});
});
