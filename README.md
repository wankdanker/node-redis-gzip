redis-gzip
----------

Automatically gzip and gunzip on calls to new methods: setz, getz, mgetz

example
-------

```js
var redz = require('redis-gzip');
var redis = require('redis');

var client = redz(redis.createClient());

client.setz('zkey', 'z nice long value that shall be compressed with gzip', function (err, result) {
	client.getz('zkey', function (err, result) {
		console.log(arguments);

		client.end();
	});
});
```

api
---

### redz = require('redis-gzip')

Get a reference to the module

### client = redz(redisClient)

* redisClient: the redis client to which you want to add gzip functions

### client.setz(key, val, cb)

Store a key/value pair to redis where the value is first gzipped

* key: the key name where you want to store val
* val: the value that will be stored compressed
* cb(err, result): called when gzipped saved to redis

### client.getz(key, cb)

Get a value from redis and gunzip it before returning it

* key: the key whose value you want to retrieve
* cb(err, result): called with gunzipped results from redis

### client.mgetz(keys, cb)

Get multiple values based on multiple keys from redis. Each value is gunzipped
before being returned

* keys: array: an array of keys whose values are to be returned
* cb(err, result):
  * err: an error message from redis or gunzip if any
  * result: array: gunzipped values for each of the requested keys

license
-------

MIT


