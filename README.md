[![Build Status](https://travis-ci.org/andrew--r/utransition.svg?branch=master)](https://travis-ci.org/andrew--r/utransition)

# utransition

A tiny library providing you an easy way to manage time-based transitions.

## Usage

```javascript
import utransition from 'utransition';

const transition = utransition(200, requestAnimationFrame);

transition.onStart = function () {
	console.log('transition started');
};

transition.onProgress = function (easedProgress, linearProgress) {
	console.log(`eased progress: ${easedProgress}`);
	console.log(`linear progress: ${linearProgress}`);

	if (linearProgress > 0.5) {
		transition.abort();
	}
}

transition.onEnd = function () {
	console.log('transition finished');
}

transition.onAbort = function () {
	console.log('transition aborted');
}

transition.start();
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

Custom easing function.

### transition object

Created by `utransition` call:

```javascript
const transition = utransition(200, requestAnimationFrame);
```

#### transition.start

Type: `Function`

Starts transition. You can't override this method:

```javascript
const transition = utransition(...);
transition.start = () => {}; // will have no effect
```

#### transition.abort

Type: `Function`

Aborts transition. Not overridable.

#### transition.onStart

Type: `Function`<br />
Context: `transition`

Called when transition starts. Usage:

```javascript
const transition = utransition(...);
transition.onStart = function () {
	transition.abort(); // or this.abort()
}
```

#### transition.onProgress

Type: `Function`
Arguments: `Number` easedProgress, `Number` linearProgress

Called on every timer tick. Usage:

```javascript
const transition = utransition(...);
transition.onProgress = function (easedProgress, linearProgress) {
	if (linearProgress > 0.5) {
		transition.abort();
	}
}
```

#### transition.onEnd

Type: `Function`

Called when transition ends. Usage:

```javascript
const transition = utransition(...);
transition.onEnd = function () {
	console.log('transition finished!');
}
```

#### transition.onAbort

Type: `Function`

Called when transition aborts by calling `transition.abort()`. Usage:

```javascript
const transition = utransition(...);
transition.onAbort = function () {
	console.log('transition aborted!');
}
```
