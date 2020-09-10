#!/usr/bin/env node

const
	ts = require("typescript"),
	fs = require("fs"),
	path = require('upath'),
	process = require('process'),
	arg = require('arg'),
	log = require('./log');

const
	cwd = process.cwd(),
	pathToTypescriptConfig = path.join(cwd, 'tsconfig.json'),
	typescriptConfigExists = fs.existsSync(pathToTypescriptConfig);

let
	tsconfigFile;

if (!typescriptConfigExists) {
	log.setFailed(`Config file "tsconfig.json" doesn't exists in ${cwd}`);

} else {
	tsconfigFile = ts.readJsonConfigFile(pathToTypescriptConfig, (path) => fs.readFileSync(path, {encoding: 'utf-8'}));
}

const config = ts.parseJsonSourceFileConfigFileContent(
	tsconfigFile,
	{
		useCaseSensitiveFileNames: true,
		readDirectory: ts.sys.readDirectory,
		readFile: ts.sys.readFile,
		fileExists: ts.sys.fileExists
	},
	'.',
);

const formatConfig = {
	getNewLine: () => ts.sys.newLine,
	getCanonicalFileName: (fileName) => fileName,
	getCurrentDirectory: ts.sys.getCurrentDirectory
}

log.info('"tsconfig.json" successfully parsed');

const
	typescriptProgram = ts.createProgram(config.fileNames, config.options);

log.info('Typescript program created');

const
	result = ts.getPreEmitDiagnostics(typescriptProgram);

log.info('Diagnostic complete');

let
	totalErrors = 0;

const
	maxErrors = arg({'--max-errors': Number}, {permissive: true})['--max-errors'] || 0;

for (let i = 0; i < result.length; i++) {
	const
		d = result[i];

	if (d.category === ts.DiagnosticCategory.Error) {
		if (d.file.fileName.includes('node_modules')) {
			continue;
		}

		log.error(ts.formatDiagnostic(d, formatConfig));
		totalErrors++;
	}

	if (d.category === ts.DiagnosticCategory.Warning) {
		log.warning(ts.formatDiagnostic(d, formatConfig))
	}

	if (d.category === ts.DiagnosticCategory.Suggestion) {
		log.info(ts.formatDiagnostic(d, formatConfig));
	}
}

if (totalErrors > maxErrors) {
	log.setFailed(`Errors found: ${totalErrors}`);
}
