var zlib = require('zlib');

module.exports = gzipRedis;

//export zlib constants
Object.keys(zlib).forEach(function (key) {
	if (/^Z_/.test(key)) {
		module.exports[key] = zlib[key];
	}
});

function gzipRedis (redis, options) {
	options = options || {};

	var gzip = zlib.gzip;
	var gunzip = zlib.gunzip;

	redis.setz = function (key, data, cb) {
		gzip(data, function (err, data) {
			if (err) {
				return cb(err);
			}

			redis.set(key, data, function (err, data) {
				if (err) {
					return cb(err);
				}

				return cb(null, data.toString());
			});
		});
	};

	redis.getz = function (key, cb) {
		redis.get(new Buffer(key), function (err, data) {
			if (err) {
				return cb(err);
			}

			gunzip(data, function (err, data) {
				if (err) {
					return cb(err);
				}

				return cb(null, data.toString());
			});
		});
	};

	redis.mgetz = function (keys, cb) {
		var k = [];

		//create a buffer for each key so detect_buffers
		//will return the results as a buffer
		keys.forEach(function (key) {
			k.push(new Buffer(key));
		});

		redis.mget(k, function (err, list) {
			gunzipEach(list, 0, cb);
		});

		function gunzipEach (list, index, cb) {
			var buf = list[index];

			if (!buf) {
				return cb(null, list);
			}

			gunzip(buf, function (err, data) {
				if (err) {
					return cb(err);
				}

				list[index] = data.toString();

				gunzipEach(list, ++index, cb);
			});
		}
	};

	return redis;
}
