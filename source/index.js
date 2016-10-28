const DURATION_TYPE_ERROR_DESCRIPTION = 'duration must be a positive non-zero number';
const DURATION_RANGE_ERROR_DESCRIPTION = DURATION_TYPE_ERROR_DESCRIPTION;

const linear = (progress) => progress;
const emptyFn = () => {};

const ERRORS = {
	invalidFrameTimestamp: 'Expected to get frame timestamp, but got something else. Make sure your custom timer passes correct timestamp to frame handler',
};

export default function utransition(duration, options = {}) {
	const {
		onStart = emptyFn,
		onTick = emptyFn,
		onEnd = emptyFn,
		easing = linear,
		timer,
	} = options;

	if (typeof duration !== 'number') {
		throw new TypeError(DURATION_TYPE_ERROR_DESCRIPTION);
	}

	if (duration <= 0) {
		throw new RangeError(DURATION_RANGE_ERROR_DESCRIPTION);
	}

	let aborted = false;
	let firstTimestamp;

	function abortTransition() {
		aborted = true;
	}

	function handleTick(timestamp) {
		if (aborted) return;
		if (typeof timestamp !== 'number') {
			throw new TypeError(ERRORS.invalidFrameTimestamp);
		}

		if (!firstTimestamp) {
			firstTimestamp = timestamp;
			onStart(abortTransition);
		}

		const progress = (timestamp - firstTimestamp) / duration;
		const easedProgress = easing(progress);

		onTick(easedProgress, progress, abortTransition);

		if (progress < 1) {
			timer(handleTick);
		} else {
			onEnd();
		}
	}

	return function startTransition() {
		timer(handleTick);
		return abortTransition;
	};
}
