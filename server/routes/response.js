module.exports = function(type) {
	var type = type;

	return new function Response() {
		this.respond = function(res, error, found, message, model, dependantModel, dependantModelProperty) {
			if(error)
				this.error(res, error);
			else
				message(res, found, model, dependantModel, dependantModelProperty);
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

		this.deleteOneAndDependancies = function(res, found, model, dependantModel, dependantModelProperty) {
			if(found) {
				if(!isEmpty(found[dependantModelProperty])) {
					// Collect all comment ids in page
					var ids = [];
					var i = 0;
					while(i < found[dependantModelProperty].length) {
						ids.push(found[dependantModelProperty][i]._id);
						i++;
					}
					// Delete dependant comments
					dependantModel.remove({_id: {$in: ids}}, function(error, foundDependancies) {
						if(error) {
							res.send(error);
						} else {
							// Delete the Page itself
							model.remove(found, function(error, foundDependancies) {
								res.send("Deleted that document and all it's dependancies.");
							});
						}
					});
				} else {
					res.send("That dependant Model property does not exist in the origional Model's Schema.");
				}
			} else {
				res.send('Could not find any documents that matched that id.');
			}
		}; 

		this.deleteByAndDependancies = function(res, found, model, dependantModel, dependantModelProperty) {
			if(found) {
				if(!isEmpty(found[0][dependantModelProperty])) {
					var ids = [];
					var pageids = [];
					var j = 0;
					while(j < found.length) {
						pageids.push(found[j]._id);
						var i = 0;
						while(i < found[j][dependantModelProperty].length) {
							ids.push(found[j][dependantModelProperty][i]._id);
							i++;
						}
						j++;
					}

					// Delete dependant comments
					dependantModel.remove({_id: {$in: ids}}, function(error, foundDependancies) {
						if(error) {
							res.send(error);
						} else {
							// Delete the Page itself
							model.remove(found, function(error) {
								if(error) {
									res.send(error);
								} else {
									res.send("Deleted those particular documents and all their dependancies.");
								}
							});
						}
					});
				} else {
					res.send("That dependant Model property does not exist in the origional Model's Schema.");
				}
			} else {
				res.send('Could not find any documents with that criteria.');
			}
		}; 

		this.deleteAllAndDependancies = function(res, found, model, dependantModel, dependantModelProperty) {
			if(found) {
				// Deleted all comments
				dependantModel.remove({}, function(error, found) {
					if(error) {
						res.send(error);
					} else {
						if(found) {
							res.send('Deleted all ' + type + 's and dependancies.');
						} else {
							res.send('Could not find any dependancies to delete.');
						}
					}
				});
			} else {
				res.send('Could not find any documents to delete.');
			}
		}; 
	}; //return Response();
}