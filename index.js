#!/usr/bin/env node

const
	ts = require('typescript'),
	fs = require('fs'),
	path = require('upath'),
	process = require('process'),
	arg = require('arg'),
	log = require('./log');

const
	defaultTypescriptConfigFilename = 'tsconfig.json';

const
	cwd = process.cwd(),
	cliArgs = arg({'--tsconfig-filename': String, '--max-errors': Number}, {permissive: true}),
	typescriptConfigFilename = cliArgs['--tsconfig-filename'] || defaultTypescriptConfigFilename,
	pathToTypescriptConfig = path.join(cwd, typescriptConfigFilename),
	typescriptConfigExists = fs.existsSync(pathToTypescriptConfig);

let
	tsconfigFile;

if (!typescriptConfigExists) {
	log.setFailed(`Config file ${typescriptConfigFilename} doesn't exists in ${cwd}`);

} else {
	tsconfigFile = ts.readJsonConfigFile(pathToTypescriptConfig, (path) => fs.readFileSync(path, {encoding: 'utf-8'}));
}

const config = ts.parseJsonSourceFileConfigFileContent(
	tsconfigFile,
	{
		useCaseSensitiveFileNames: true,

		// Temporary fix of the undocumented breaking change in Typescript 4.4
		// https://github.com/microsoft/TypeScript/issues/45990
		readDirectory: (relativePath, ...restArgs) => {
			const
				absolutePath = path.resolve(relativePath);

			return ts.sys.readDirectory(absolutePath, ...restArgs);
		},

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

log.info(`${typescriptConfigFilename} has been successfully parsed`);

const
	typescriptProgram = ts.createProgram(config.fileNames, config.options);

log.info('Typescript program has been created');

const
	result = ts.getPreEmitDiagnostics(typescriptProgram);

log.info('Diagnostic has been completed');

let
	totalErrors = 0;

const
	maxErrors = cliArgs['--max-errors'] || 0;

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
	log.setFailed(`Errors found: ${totalErrors}${maxErrors > 0 ? `. Errors allowed: ${maxErrors}` : ''}`);

} else if (maxErrors > 0) {
	log.warning(`Errors found: ${totalErrors}. Errors allowed: ${maxErrors}`);
}
