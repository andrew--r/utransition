const DURATION_TYPE_ERROR_DESCRIPTION = 'duration must be a positive non-zero number';
const DURATION_RANGE_ERROR_DESCRIPTION = DURATION_TYPE_ERROR_DESCRIPTION;

const linear = (progress) => progress;
const emptyFn = () => {};

export default function utransition(duration, options = {}) {
	const {
		onStart = emptyFn,
		onFrame = emptyFn,
		onEnd = emptyFn,
		easing = linear,
	} = options;

	if (typeof duration !== 'number') {
		throw new TypeError(DURATION_TYPE_ERROR_DESCRIPTION);
	}

	if (duration <= 0) {
		throw new RangeError(DURATION_RANGE_ERROR_DESCRIPTION);
	}

	let aborted = false;
	let firstFrameTimestamp;

	function abortTransition() {
		aborted = true;
	}

	function handleFrame(frameTimestamp) {
		if (aborted) return;
		if (!firstFrameTimestamp) {
			firstFrameTimestamp = frameTimestamp;
			onStart(abortTransition);
		}

		const progress = (frameTimestamp - firstFrameTimestamp) / duration;
		const easedProgress = easing(progress);

		onFrame(easedProgress, progress, abortTransition);

		if (progress < 1) {
			requestAnimationFrame(handleFrame);
		} else {
			onEnd();
		}
	}

	return function startTransition() {
		requestAnimationFrame(handleFrame);
		return abortTransition;
	};
}
