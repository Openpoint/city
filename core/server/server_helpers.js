"use strict";

/**
 * Provides various helper functions to boot the application.
 *
 * @module helpers
 * @chapter server
 */


var fs = require("fs");
var pg = require('pg');


/**
 * Get the app start seed settings from __root__/settings.json
 * @return {object}
 *
 * */
exports.get_settings=function(){
	var qpath=__root+'/settings.json';
	if(fs.existsSync(qpath)){
		var settings=JSON.parse(fs.readFileSync(qpath, 'utf8'));
	}else{
		var settings={};
		settings.db={};
		settings.nodeport=null;
	}
	return settings;
}

/**
 * Create a pg database connection string from a settings object
 * @param {!object<module:server/helpers.get_settings>} data - The 'settings' object for the database
 * @return {string}
 *
 * */
exports.makestring=function(data){
	 return "postgres://"+data.user+":"+data.pass+"@"+data.host+":"+data.port+"/"+data.dbase;
}

/*------------------------------------------------------------ Write the app start seed settings to file @ install time */
/**
 * Write the app start seed settings to file @ install time
 * @param {!object<module:server/helpers.get_settings>} settings - The 'settings' object for the database
 * @return {promise}
 *
 * */
exports.write_settings=function(settings){
	var promise = new Promise(function(resolve, reject){
		fs.writeFileSync(__root+"/settings.json", JSON.stringify(settings,null,'\t'));
		resolve();
	});
	return promise;
}

/*------------------------------------------------------------ Check if the database can be connected to */
/**
 * Check if the database can be connected to
 * @param {!object<module:admin.get_settings>} data - The 'settings' object for the database
 * @return {promise}
 *
 * */
exports.check_db=function(data){
	var conString = exports.makestring(data);
	var promise = new Promise(function(resolve, reject){

		pg.connect(conString, function(err, client, done) {
			
			if(err){
				console.error(err)
				resolve(err.message);
			}else{
				// inject the correct connection string into the CRUD processes
				require(__root+'/core/server/server_crud.js').fixstring(conString);
				resolve(false);
			}
		})
	})
	return promise;
}
