module.exports = function() {

	// return function() {
		return new function Response() {

			var self = this;
			self.type = 'document';

			this.setType = function(type) {
				self.type = type;
			};

			this.getType = function() {
				return self.type;
			};

			this.respond = function(res, error, found, message, callback, callbackParams) {
				if(error)
					this.error(res, error);
				else
					if(callback)
						callback(res, error, found, callbackParams);
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
					res.send('A ' + self.getType() + ' was created.');
				} else {
					res.send('Could not create ' + self.getType() + '.');
				}
			}; 

			this.createAndLink = function(res, found) {
				if(found) {
					res.send('Added ' + self.getType() + ' and linked to ' + found);
				} else {
					res.send('Could not add the ' + self.getType() + ' and link.');
				}
			}; 

			this.find = function(res, found) {
				if(found) {
					res.setHeader('Content-Type', 'application/json');
					res.send(JSON.stringify(found));
				} else {
					res.send('Could not find any ' + self.getType() + 's with that query.');
				}
			}; 

			this.update = function(res, found) {
				if(found) {
					res.send(found + ' ' + self.getType() + 's were updated.');
				} else {
					res.send('Could not find those ' + self.getType() + 's. Please use {idenfitier: {}, replacementData: {}}');
				}
			}; 

			this.delete = function(res, found) {
				if(found) {
					res.send('Deleted ' + found + ' ' + self.getType() + 's matching that criteria.');
				} else {
					res.send('Did not find any ' + self.getType() + 's by that criteria.');
				}
			}; 

			this.deleteAndDependancies = function(res, found) {
				if(found) {
					res.send('Deleted those particular ' + self.getType() + 's and their dependancies.');
				} else {
					res.send('Deleted those ' + self.getType() + 's but could not find any dependancies to delete.');
				}
			}; 

			this.deleteAndUnlink = function(res, found) {
				if(found) {
					res.send('Deleted ' + found + ' ' + self.getType() + 's and unlinked them.')
				} else {
					res.send('Could not find any ' + self.getType() + 's with that criteria to delete.');
				}
			}; 

		}; //return Response();
	// } //return
}