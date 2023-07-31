const db = require('../db');
const config = require('../config/config');

const resultsQuery = config.env === 'production' 
	? "SELECT json_agg(t) FROM public.getResults('"+config.race.id+"', '"+config.race.categories+"', "+config.race.stageId+")"
	: "SELECT * FROM results" // mocked data on my local

module.exports = {
	getResults: (res) => db.query(resultsQuery, function(err, results){
		if(err){ 
			console.log(err);
		} else {
			res.send(results);
		}
	})
}