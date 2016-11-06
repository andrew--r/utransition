var expect = require('chai').expect;
var packageJson = require('../package.json');
var utransition = require(`../build/utransition-${packageJson.version}`).default;


const TICK_DELAY = 16;
const TEST_DURATION = TICK_DELAY * 5;
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

		it('should throw a TypeError if timer is not a function', () => {
			expect(() => utransition(1, 2)).to.throw(TypeError);
		});

		it('should throw an Error when custom timer is not passing timestamp to tick handler', () => {
			expect(() => {
				const transition = utransition(1, (fn) => fn());
				transition.play();
			}).to.throw(TypeError);
		});

		it('should throw a TypeError when easing is not a function', () => {
			expect(() => utransition(1, timer, 1)).to.throw(TypeError);
		});

		it('should not allow overriding play(), pause() and abort() methods', () => {
			const transition = utransition(1, timer);
			let play = 0;
			let pause = 0;
			let abort = 0;

			transition.play = () => {
				play = 1;
			};

			transition.pause = () => {
				pause = 1;
			};

			transition.abort = () => {
				abort = 1;
			};

			transition.onStart = () => {
				transition.pause();
			};

			transition.onPause = () => {
				transition.play();
			};

			transition.onResume = () => {
				transition.abort();
			};

			expect(play).to.be.equal(0);
			expect(pause).to.be.equal(0);
			expect(abort).to.be.equal(0);

			transition.play();

			expect(play).to.be.equal(0);
			expect(pause).to.be.equal(0);
			expect(abort).to.be.equal(0);
		});

		it('should not allow overriding state, linearProgress and easedProgress properties', () => {
			const transition = utransition(1, timer);

			expect(transition.state).to.be.equal('stopped');
			expect(transition.linearProgress).to.be.equal(0);
			expect(transition.easedProgress).to.be.equal(0);

			transition.state = 'hell yeah';
			transition.linearProgress = 'anarchy';
			transition.easedProgress = 'no rules!';

			expect(transition.state).to.be.equal('stopped');
			expect(transition.linearProgress).to.be.equal(0);
			expect(transition.easedProgress).to.be.equal(0);
		});
	});

	describe('initialization', () => {
		it('should return an API object correct methods and properties', () => {
			const transition = utransition(200, timer);

			expect(transition).to.be.an('object');
			expect(transition.play).to.be.a('function');
			expect(transition.pause).to.be.a('function');
			expect(transition.abort).to.be.a('function');
			expect(transition.state).to.be.equal('stopped');
			expect(transition.linearProgress).to.be.equal(0);
			expect(transition.easedProgress).to.be.equal(0);
		});
	});

	describe('callbacks', () => {
		it('should invoke onStart() when transition starts', () => {
			let started = false;

			const transition = utransition(200, timer);
			transition.onStart = () => {
				started = true;
			};

			expect(started).to.be.false;
			transition.play();
			expect(started).to.be.true;
		});

		it('should invoke onPause when transition pauses', () => {
			let paused = false;

			const transition = utransition(200, timer);

			transition.onStart = () => {
				transition.pause();
			};

			transition.onPause = () => {
				paused = true;
			};

			expect(paused).to.be.false;
			transition.play();
			expect(paused).to.be.true;
		});

		it('should invoke onResume when transition resumes', () => {
			let resumed = false;

			const transition = utransition(200, timer);

			transition.onStart = () => {
				transition.pause();
			};

			transition.onPause = () => {
				transition.play();
			};

			transition.onResume = () => {
				resumed = true;
			};

			expect(resumed).to.be.false;
			transition.play();
			expect(resumed).to.be.true;
		});

		it('should invoke onAbort when transition aborts', () => {
			let aborted = false;

			const transition = utransition(200, timer);

			transition.onStart = () => {
				transition.abort();
			};

			transition.onAbort = () => {
				aborted = true;
			};

			expect(aborted).to.be.false;
			transition.play();
			expect(aborted).to.be.true;
		});

		it('should invoke onEnd when transition ends', () => {
			let ended = false;

			const transition = utransition(200, timer);

			transition.onEnd = () => {
				ended = true;
			};

			expect(ended).to.be.false;
			transition.play();
			expect(ended).to.be.true;
		});
	});

	describe('behaviour', () => {
		it('should start transition', () => {
			const transition = utransition(TEST_DURATION, timer);
			expect(transition.state).to.be.equal('stopped');
			expect(transition.linearProgress).to.be.equal(0);
			expect(transition.linearProgress).to.be.equal(0);

			transition.onStart = () => {
				expect(transition.state).to.be.equal('in progress');
				expect(transition.linearProgress).to.be.equal(0);
				expect(transition.linearProgress).to.be.equal(0);
			};

			transition.play();
		});

		it('should pause transition', () => {
			const transition = utransition(TEST_DURATION, timer);
			expect(transition.state).to.be.equal('stopped');
			expect(transition.linearProgress).to.be.equal(0);
			expect(transition.linearProgress).to.be.equal(0);

			transition.onProgress = () => {
				if (transition.linearProgress === 0.4) {
					transition.pause();
				}
			};

			transition.play();

			expect(transition.state).to.be.equal('paused');
			expect(transition.linearProgress).to.be.equal(0.4);
		});

		it('should resume transition', () => {
			const transition = utransition(TEST_DURATION, timer);
			expect(transition.state).to.be.equal('stopped');
			expect(transition.linearProgress).to.be.equal(0);
			expect(transition.linearProgress).to.be.equal(0);

			transition.onProgress = () => {
				if (transition.linearProgress === 0.4) {
					transition.pause();
				}
			};

			transition.onResume = () => {
				expect(transition.state).to.be.equal('in progress');
				expect(transition.linearProgress).to.be.equal(0.4);
			};

			transition.play();
			expect(transition.state).to.be.equal('paused');
			expect(transition.linearProgress).to.be.equal(0.4);

			transition.play();
			expect(transition.state).to.be.equal('stopped');
			expect(transition.linearProgress).to.be.equal(1);
		});

		it('should correctly calculate eased progress and linear progress', () => {
			const progressHistory = [];

			const transition = utransition(TEST_DURATION, timer, (p) => p * 2);
			transition.onProgress = () => {
				progressHistory.push([transition.linearProgress, transition.easedProgress]);
			};

			expect(progressHistory).to.deep.equal([]);
			transition.play();
			expect(progressHistory).to.deep.equal([
				[0.2, 0.4],
				[0.2 * 2, 0.2 * 2 * 2],
				[0.2 * 3, 0.2 * 3 * 2],
				[0.2 * 4, 0.2 * 4 * 2],
				[0.2 * 5, 0.2 * 5 * 2],
			]);
		});

		it('should reset progress after abort() call', () => {
			const transition = utransition(TEST_DURATION, timer);
			transition.onProgress = () => {
				if (transition.linearProgress === 0.4) {
					transition.abort();
				}
			};

			expect(transition.linearProgress).to.equal(0);
			expect(transition.easedProgress).to.equal(0);
			transition.play();
			expect(transition.linearProgress).to.equal(0);
			expect(transition.easedProgress).to.equal(0);
		});
	});
});
