[![Build Status](https://travis-ci.org/andrew--r/utransition.svg?branch=master)](https://travis-ci.org/andrew--r/utransition)

# utransition

A tiny (~2KB) library providing you an easy way to manage time-based transitions. You just set prefered duration and easing and then specify how things should change basing on transition progress. For example, you can write small wrapper around this library that allows you to animate page scroll dynamically.

utransition is available via npm:

```bash
$ npm install utransition
```

## Usage

```javascript
import utransition from 'utransition';

const transition = utransition(200, requestAnimationFrame);
let wasPaused = false;

transition.onStart = () => {
	console.log('transition started');
};

transition.onProgress = () => {
	console.log(`eased progress: ${transition.easedProgress}`);
	console.log(`linear progress: ${transition.linearProgress}`);

	if (linearProgress > 0.4 && !wasPaused) {
		transition.pause();
	} else if (wasPaused && linearProgress > 0.6) {
		transition.abort();
	}
}

transition.onPause = () => {
	console.log('transition paused');
};

transition.onResume = () => {
	console.log('transition resumed');
};

transition.onAbort = () => {
	console.log('transition aborted');
}

transition.onEnd = () => {
	console.log('transition finished');
}

transition.play();
```

## API

### utransition(duration, timer[, easing])

Creates a transition object.

Example:

```javascript
const myTransition = utransition(200, requestAnimationFrame);
```

#### duration

Type: `Number`<br />
Minimum: `1`

Transition duration in milliseconds.

#### timer

Type: `Function`

Timer like `window.requestAnimationFrame`.

#### easing

Type: `Function`<br />
Default: linear `(progress) => progress`

Custom easing function that takes linear progress in range from 0 to 1 and should return eased progress.

### transition object

Created by `utransition` call:

```javascript
const transition = utransition(200, requestAnimationFrame);

// API:
transition === {
	play() {},
	pause() {},
	abort() {},

	onStart() {},
	onPause() {},
	onResume() {},
	onAbort() {},
	onEnd() {},

	state: Enumerable['stopped', 'in progress', 'paused'],
	easedProgress: Number,
	linearProgress: Number,
};
```

All callbacks are invoked in the `transition` context, so you can
do things like `this.abort()` inside callbacks.

#### transition.state

Type: `String`<br />
Overridable: `false`

Current transition state. One of `stopped`, `paused`, `in progress`.

#### transition.linearProgress

Type: `Number`<br />
Overridable: `false`

Current linear progress.

#### transition.easedProgress

Type: `Number`<br />
Overridable: `false`

Current eased progress.

#### transition.play()

Type: `Function`<br />
Overridable: `false`

Starts or resumes transition.

#### transition.pause()

Type: `Function`<br />
Overridable: `false`

Pauses transition.

#### transition.abort()

Type: `Function`<br />
Overridable: `false`

Aborts transition.

#### transition.onStart

Type: `Function`<br />
Overridable: `true`<br />
Context: `transition`

Called when transition starts. Usage:

```javascript
const transition = utransition(...);
transition.onStart = () => {
	console.log('transition started');
};
```

#### transition.onPause

Type: `Function`<br />
Overridable: `true`<br />
Context: `transition`

Called when transition pauses. Usage:

```javascript
const transition = utransition(...);
transition.onPause = () => {
	console.log('transition paused');
};
```

#### transition.onResume

Type: `Function`<br />
Overridable: `true`<br />
Context: `transition`

Called when transition resumes. Usage:

```javascript
const transition = utransition(...);
transition.onResume = () => {
	console.log('transition resumed');
};
```

#### transition.onAbort

Type: `Function`<br />
Overridable: `true`<br />
Context: `transition`

Called when transition aborts. Usage:

```javascript
const transition = utransition(...);
transition.onAbort = () => {
	console.log('transition aborted');
}
```

#### transition.onProgress

Type: `Function`<br />
Overridable: `true`<br />
Context: `transition`

Called on every timer tick except first tick after start or resume. Usage:

```javascript
const transition = utransition(...);
transition.onProgress = () => {
	if (transition.linearProgress > 0.5) {
		transition.abort();
	}
}
```

#### transition.onEnd

Type: `Function`<br />
Overridable: `true`<br />
Context: `transition`

Called when transition ends. Usage:

```javascript
const transition = utransition(...);
transition.onEnd = () => {
	console.log('transition finished!');
}
```
