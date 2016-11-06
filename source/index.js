const ERRORS = {
	invalidDuration: 'duration must be a positive non-zero number',
	invalidTimer: 'timer must be a function',
	invalidTickTimestampType: 'Expected to get tick timestamp, but got something else. Make sure your custom timer passes correct timestamp to tick handler',
	invalidEasing: 'easing must be a function',
};

const STATES = {
	stopped: 'stopped',
	paused: 'paused',
	inProgress: 'in progress',
};

const linear = (progress) => progress;
const emptyFn = () => {};

function validateParameters(duration, timer, easing) {
	if (typeof duration !== 'number') {
		throw new TypeError(ERRORS.invalidDuration);
	}

	if (duration <= 0) {
		throw new RangeError(ERRORS.invalidDuration);
	}

	if (typeof timer !== 'function') {
		throw new TypeError(ERRORS.invalidTimer);
	}

	if (typeof easing !== 'function') {
		throw new TypeError(ERRORS.invalidEasing);
	}
}

export default function utransition(duration, timer, easing = linear) {
	validateParameters(duration, timer, easing);

	let state = STATES.stopped;
	let started = false;
	let aborted = false;
	let paused = false;
	let prevTimestamp;
	let linearProgress = 0;
	let easedProgress = 0;

	const API = {
		onStart: emptyFn,
		onPause: emptyFn,
		onResume: emptyFn,
		onAbort: emptyFn,

		onProgress: emptyFn,
		onEnd: emptyFn,

		get state() {
			return state;
		},

		get linearProgress() {
			return linearProgress;
		},

		get easedProgress() {
			return easedProgress;
		},
	};

	Object.defineProperties(API, {
		play: {
			enumerable: true,
			value() {
				paused = false;
				aborted = false;
				state = STATES.inProgress;
				timer(handleTick);
			},
		},

		pause: {
			enumerable: true,
			value() {
				paused = true;
			},
		},

		abort: {
			enumerable: true,
			value() {
				started = false;
				aborted = true;
				linearProgress = 0;
				easedProgress = 0;
			},
		},
	});

	function handleTick(timestamp) {
		if (aborted) {
			state = STATES.stopped;

			if (typeof API.onAbort === 'function') {
				API.onAbort();
			}

			return;
		}

		if (paused) {
			state = STATES.paused;
			prevTimestamp = null;

			if (typeof API.onPause === 'function') {
				API.onPause();
			}

			return;
		}

		if (typeof timestamp !== 'number') {
			throw new TypeError(ERRORS.invalidTickTimestampType);
		}

		if (!prevTimestamp) {
			prevTimestamp = timestamp;

			if (!started && typeof API.onStart === 'function') {
				started = true;
				API.onStart();
			} else if (started && typeof API.onResume === 'function') {
				API.onResume();
			}
		}

		linearProgress += (timestamp - prevTimestamp) / duration;
		easedProgress = easing(linearProgress);

		if (timestamp - prevTimestamp && typeof API.onProgress === 'function') {
			API.onProgress();
		}

		prevTimestamp = timestamp;

		if (linearProgress < 1) {
			timer(handleTick);
		} else {
			state = STATES.stopped;
			linearProgress = 1;
			easedProgress = easing(linearProgress);

			if (typeof API.onEnd === 'function') {
				API.onEnd();
			}
		}
	}

	return API;
}
