var redisz = require('./');
var redis = require('redis');
var test = require('tape');
var zlib = require('zlib');


test('setz creates a gzipped value in redis', function (t) {
	var client = redisz(redis.createClient({ detect_buffers : true }));

	t.plan(4);

	client.setz('ztest', 'hello there', function (err, result) {
		t.false(err, 'no error returned form redis.setz');

		client.get(new Buffer('ztest'), function (err, buf) {
			t.false(err, 'no error returned from redis.get');

			zlib.gunzip(buf, function (err, data) {
				t.false(err, 'no error returned from zlib.gunzip');

				t.equal(data.toString(), 'hello there');

				client.end();
				t.end();
			});
		});

	});
});

test('setz creates and getz reads', function (t) {
	var client = redisz(redis.createClient({ detect_buffers : true }));

	t.plan(3);

	client.setz('ztest2', 'hello there2', function (err, result) {
		t.false(err, 'no error returned form redis.setz');

		client.getz('ztest2', function (err, data) {
			t.false(err, 'no error returned from redis.getz');
			t.equal(data, 'hello there2');

			client.end();
			t.end();
		});
	});
});

test('mgetz reads multiple', function (t) {
	var client = redisz(redis.createClient({ detect_buffers : true }));

	t.plan(3);

	client.setz('ztest3', 'hello there3', function (err, result) {
		t.false(err, 'no error returned form redis.setz');

		client.mgetz(['ztest', 'ztest2', 'ztest3'], function (err, data) {
			t.false(err, 'no error returned from redis.mgetz');
			t.deepEqual(data, ['hello there', 'hello there2', 'hello there3']);

			client.end();
			t.end();
		});
	});
});
