module.exports = function(type) {
	var type = type;

	return new function Response() {
		this.respond = function(res, error, found, message) {
			if(error)
				this.error(res, error);
			else
				message(res, found);
		};

		// CRUD Errors
		this.error = function(res, error) {
			return res.send(error);
		}; 

		// CRUD Success
		this.create = function(res, found) {
			if(found) {
				res.send('A ' + type + ' was created.');
			} else {
				res.send('Could not create ' + type + '.');
			}
		}; 

		this.findOne  = function(res, found) {
			if(found) {
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify(found));
			} else {
				res.send('Could not find that ' + type + '.');
			}
			
		}; 

		this.findBy = function(res, found) {
			if(found) {
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify(found));
			} else {
				res.send('Could not find any ' + type + 's with that query.');
			}
		}; 

		this.findAll  = function(res, found) {
			if(found) {
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify(found));
			} else {
				res.send('Could not find any '+type+'s.');
			}
		}; 

		this.updateOne = function(res, found) {
			if(found) {
				res.send('A ' + type + ' was updated.');
			} else {
				res.send('Could not find that ' + type + ' to update.');
			}
		}; 

		this.updateBy = function(res, found) {
			if(found) {
				res.send(found + ' ' + type + 's were updated.');
			} else {
				res.send('Could not find those '+type+'s. Please use {idenfitier: {}, replacementData: {}}');
			}
		}; 

		this.updateAll = function(res, found) {
			if(found) {
				res.send('All ' + found + ' of your '+type+'s were updated.');
			} else {
				res.send('Could not update any ' + type + 's.');
			}
		}; 

		this.deleteOne = function(res, found) {
			if(found) {
				res.send('A ' + type + ' was deleted.');
			} else {
				res.send('Could not find that ' + type + ' to delete.');
			}
		}; 

		this.deleteBy = function(res, found) {
			if(found) {
				res.send('Deleted ' + found + ' ' + type + 's matching that criteria.');
			} else {
				res.send('Did not find any '+ type +'s by that criteria.');
			}
		}; 

		this.deleteAll = function(res, found) {
			if(found) {
				res.send('Deleted all ' + found + ' ' + type + 's in the database.');
			} else {
				res.send('Could not delete any ' + type + 's.');
			}
		};

		this.deleteOneAndDependants = function(res, found) {
			if(found) {
				res.send('A ' + type + ' was deleted.');
			} else {
				res.send('Could not find that ' + type + ' to delete.');
			}
		}; 
	};
}