
import express from 'express';
import fs      from 'fs';



const DATABASE = (() => {

	let buffer = fs.readFileSync('./database.json');
	let data   = [];

	try {
		data = JSON.parse(buffer.toString('utf8'));
	} catch (err) {
		data = [];
	}

	return data;

})();



const APP = express();

APP.use(express.static('public'));
APP.use(express.json());

APP.get('/api/tasks', (request, response) => {
	response.send(DATABASE);
});

APP.post('/api/tasks/create', (request, response) => {

	console.log('CREATE task', request.body);

	// TODO: Check for conflict of identifier

	response.send({
		foo: 'bar'
	});

});

APP.listen(3000, () => {
	console.log('Agenda Server running on port 3000');
});

