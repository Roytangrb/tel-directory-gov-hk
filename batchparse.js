const fs = require('fs');
const readline = require('readline');
const stream =  require('stream');
// file parsed must be csv

const args  = process.argv.slice(2);
const titles = ["name", "head", "inquiry", "bureau"]
let outputPath, deptKey, instream, outstream, rl, bigJson, json, iskeyLine, col_count_cache, secCount, declare, exportD, tokens, item, output;

let fileCount = 0;
let lineCount = 0;


const parseOne = (filename)=>{
	if (fileCount === args.length) return;
	console.log(filename)

	//utils
	instream = fs.createReadStream('./struct_'+filename + '.csv');
	outstream = new stream;
	rl = readline.createInterface(instream, outstream);

	deptKey = /CHI/.test(filename)? "機構":"Organisation" //test the file is Chinese or English

	bigJson = {};
	json = [];
	keys = [];
	iskeyLine = true;
	col_count_cache = 4;
	secCount = 0; 

	declare = "const " + filename + " = "
	exportD = " export default " + filename
	//process line
	rl.on('line', line=>{
		lineCount++;
		tokens = line.trim().match(/".*?"/g).map(str=> str.replace(/"/g, ''))
		item = {}

		if (tokens.length > 1) { //get rid of dummy lines
			if (iskeyLine){
				bigJson[titles[secCount++]] = [...json] //value of name for now will be assigned to a {}
				json = [] //restore json to empty for next section
				//console.log({iskeyLine})
				keys = [...tokens]
				iskeyLine = false
			}
			//convert to json using keys 
			else { //keys array length should be the same as tokens, if not error
				//console.log("parsing")
				tokens.map((val, i) =>{
					return item[keys[i]] = val
				})
				json.push(item)
			}
		} else {
			iskeyLine = true; // flag the next line as key line
		}
	})

	rl.on('close', ()=>{
		console.log("closed", {lineCount})
		//put the last section back to bigJson 
		bigJson[titles[secCount++]] = [...json]
		//mutate the name with value
		bigJson["name"] = bigJson["head"][0][deptKey]
		//console.log('json', bigJson)
		if (secCount > 4 || secCount < 3){throw new Error("Total number of sections is not correct")};
		output = declare + JSON.stringify(bigJson, null, 4) + exportD
		fileCount ++
		outputPath = 'JSON/'+filename+'.js'
		fs.writeFile(outputPath, output, 'utf-8', ()=>{parseOne(args[fileCount]);})
	})
}

parseOne(args[fileCount]);
