var Transform  = require('stream').Transform;
var program = require('commander');
var util = require('util');
var fs = require('fs');
var text = fs.createReadStream('input-sensor.txt');

//For Node 0.8 users 
if(!Transform) {
	Transform = require('readable-stream/transform'); 
}

function PatternMatch(patterns) {
	Transform.call(this, { objectMode: true });
	this.pattern = patterns;
}

util.inherits(PatternMatch, Transform);

program
	.option('-p, --pattern <pattern>', 'Input Patterns such as . ,') 
	.parse(process.argv);

var patternStream = text.pipe(new PatternMatch(program.pattern)); 
patternStream.on(
	'readable', 
	 function() { 
		var line 
		while(null !== (line = this.read())){   
			console.log(line.toString('ascii')); 
		} 
	}); 

PatternMatch.prototype._transform = function(chunk, encoding, getNextChunk) { 
	var data = chunk.toString('ascii'); 
	this.push('-------------------------------INPUT------------------------------'); 
	this.push(data); 
	
	var parse = data.split(this.pattern)
	parse.splice(parse.length-1, 1);

 	this.push("----------------------------------OUTPUT---------------------------------"); 
	
	for(var i = 0; i < parse.length; i++){
		if(i == 0){
			this.push("[ " + "'" + parse[i] + "'" + ",");
		}
		else if(i != parse.length - 1){
			this.push("'" + parse[i].slice(1) + "'" + ",");
		}
		else{
			this.push("'" + parse[i].slice(1) + "'" + " ]");
		}
	}
	getNextChunk();  
}

PatternMatch.prototype._flush = function(flushCompleted) {

}
