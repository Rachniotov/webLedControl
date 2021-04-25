const express = require('express');
const gpio = require('pigpio').Gpio;
const { Server } = require('socket.io');
const app = express();

const led = new gpio(17, { mode: gpio.OUTPUT });
led.digitalWrite(0);

const server = app.listen('3000', () => {
	console.log('listening to port 3000');
});

const io = new Server(server);

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
	console.log(`user connected, with id: ${socket.id}`);
	socket.on('disconnect', () => {
		console.log(`user disconnected, with id: ${socket.id}`);
	});
	socket.on('toggle', (val) => {
		if (val === 1) {
			led.digitalWrite(val);
		} else {
			led.digitalWrite(val);
		}

	})
});

process.on('SIGINT', () => {
	led.digitalWrite(0);
	console.log('\ncleared ports');
	process.exit(0);
})