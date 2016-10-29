const ERRORS = {
	invalidDuration: 'duration must be a positive non-zero number',
	invalidTimer: 'timer must be a function',
	invalidTickTimestampType: 'Expected to get tick timestamp, but got something else. Make sure your custom timer passes correct timestamp to tick handler',
	invalidTickTimestampValue: 'Timer works incorrectly, it should return increasing values but not decreasing',
};

const linear = (progress) => progress;
const emptyFn = () => {};

export default function utransition(duration, timer, easing = linear) {
	if (typeof duration !== 'number') {
		throw new TypeError(ERRORS.invalidDuration);
	}

	if (duration <= 0) {
		throw new RangeError(ERRORS.invalidDuration);
	}

	if (typeof timer !== 'function') {
		throw new TypeError(ERRORS.invalidTimer);
	}

	// ensure timer is working correctly
	let firstTestTimestamp;
	let secondTestTimestamp;
	timer((t) => {
		firstTestTimestamp = t;
	});

	timer((t) => {
		secondTestTimestamp = t;
	});

	if (typeof firstTestTimestamp !== 'number' || typeof secondTestTimestamp !== 'number') {
		throw new TypeError(ERRORS.invalidTickTimestampType);
	}

	if (firstTestTimestamp > secondTestTimestamp) {
		throw new Error(ERRORS.invalidTickTimestampValue);
	}

	const API = {
		onStart: emptyFn,
		onProgress: emptyFn,
		onEnd: emptyFn,
		onAbort: emptyFn,
	};
	let aborted = false;
	let firstTimestamp;

	Object.defineProperties(API, {
		start: {
			enumerable: true,
			value() {
				timer(handleTick);
			},
		},
		abort: {
			enumerable: true,
			value() {
				aborted = true;
			},
		},
	});

	function handleTick(timestamp) {
		if (aborted) {
			if (typeof API.onAbort === 'function') {
				API.onAbort();
			}

			return;
		}

		if (!firstTimestamp) {
			firstTimestamp = timestamp;

			if (typeof API.onStart === 'function') {
				API.onStart();
			}
		}

		const progress = (timestamp - firstTimestamp) / duration;
		const easedProgress = easing(progress);

		if (typeof API.onProgress === 'function') {
			API.onProgress(easedProgress, progress);
		}

		if (progress < 1) {
			timer(handleTick);
		} else if (typeof API.onEnd === 'function') {
			API.onEnd();
		}
	}

	return API;
}
