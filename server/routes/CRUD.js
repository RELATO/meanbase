module.exports = function(app, mongoose, models, responder) {
	return function() {
		return new function pageQuery() {
			var self = this;

			this.setModel = function(model) {
				self.model = model;
			};

			this.getIdentifer = function(req) {
				var identifier = {};
				if(!isEmpty(req.body.identifier)) {
					identifier = req.body.identifier; 
					req.body = req.body.replacementData;
				} else if (!isEmpty(req.query)) {
					identifier = req.query;
				} else if (!isEmpty(req.params))
					identifier = req.params;
				else
					identifier = {};
				return identifier;
			};

			this.create = function(req, res, newDocument, callback) {
				// Create a new document
				newDocument.save(function(error, found) {
					if(error)
						res.send(error);
					else {
						if(found) {
							if(callback)
								callback();
							else
								res.send(found);
						} else
							res.send('Could not create the ' + responder.type + '.');
					}
				});
			};

			this.createAndLink = function(req, res, newDocument, linkIdentifier, linkField, linkModel) {
				// Create a new document
				newDocument.save(function(error, found) {
					if(error) {
						res.send(error);
					} else {
						if(found) {
							var linkObject = {};
							linkObject[linkField] = newDocument._id;
							linkModel.update(linkIdentifier, {$push: linkObject}, function(error, foundPage) {
								responder.respond(res, error, foundPage, responder.createAndLink);
							});
						} else {
							res.send('Could not create the ' + responder.type + '.');
						}
					}
				});
			};

			this.find = function(req, res, populateQuery, callback) {
				var identifier = this.getIdentifer(req);
				if(!isEmpty(populateQuery)) {
					self.model.find(identifier).populate(populateQuery).exec(function(error, found) {
						responder.respond(res, error, found, responder.find, callback);	
					});
				} else {
					self.model.find(identifier, function(error, found) {
						responder.respond(res, error, found, responder.find, callback);	
					});
				}
			};

			this.findAndSort = function(req, res, sortFilter, callback) {
				var identifier = this.getIdentifer(req);
				self.model.find(identifier).sort(sortFilter).exec(function(error, found) {
					responder.respond(res, error, found, responder.find, callback);	
				});
			};

			this.update = function(req, res, callback) {
				var identifier = this.getIdentifer(req);
				console.log('identifier', identifier);
				self.model.update(identifier, req.body, {multi: true, upsert: true}, function(error, found) {
					console.log('found', found);
					responder.respond(res, error, found, responder.update, callback);	
				});
			};

			this.delete = function(req, res, callback) {
				var identifier = this.getIdentifer(req);
				self.model.remove(identifier, function(error, found) {
					responder.respond(res, error, found, responder.delete, callback);
				});
			};

			this.deleteAndDependancies = function(req, res, dependantField, dependantModel, callback) {
				var identifier = this.getIdentifer(req);
				self.model.find(identifier, function(error, foundOrigional) {
					if(error) {
						res.send(error);
					} else {
						if(foundOrigional) {
							var i = 0, ids = [];
							while(i < foundOrigional.length) {
								ids = ids.concat(foundOrigional[i][dependantField]);
								i++;
							}
							// Delete document dependancies
							dependantModel.remove({_id: {$in: ids}}, function(error, foundDependancies) {
								if(error) {
									res.send(error);
								} else {
									// Delete the document itself
									self.model.remove(identifier, function(error, foundDocument) {
										responder.respond(res, error, foundDocument, responder.deleteAndDependancies, callback, foundOrigional);
									});
								}
							});
						} else {
							res.send('Could not find any documents with that query.');
						}
					}
				}); //self.model.find
			};

			this.deleteAndUnlink = function(req, res, linkField, linkModel) {
				var identifier = this.getIdentifer(req);
				self.model.find(identifier, function(error, found) {
					if(error)
						res.send(error);
					else {
						if(found) {
							var ids = [], i = 0;
							while(i < found.length) {
								ids.push(found[i]._id);
								i++;
							}
							var dependantObject = {}, dependantObject2 = {}, endUpdateQuery = {};
							if(ids.length > 1) {
								dependantObject[linkField] = {$in: ids};
							} else {
								dependantObject[linkField] = ids[0];
							}
							dependantObject2[linkField] = ids;

							// Unlink from
							linkModel.update(dependantObject, {$pullAll: dependantObject2}, {multi: true}, function(error, found) {
								if(error)
									res.send(error);
								else {
									self.model.remove({_id: {$in: ids}}, function(error, found) {
										responder.respond(res, error, found, responder.deleteAndUnlink);
									});
								}
							});
						} else {
							res.send('Could not find any documents matching that query.');
						}
					}
				});
			};
		};
	}
};