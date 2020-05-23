const
	ts = require("typescript"),
	fs = require("fs"),
	path = require('upath'),
	process = require('process'),
	core = require('@actions/core');

const
	cwd = process.cwd(),
	pathToTypescriptConfig = path.join(cwd, 'tsconfig.json'),
	typescriptConfigExists = fs.existsSync(pathToTypescriptConfig);

let
	tsconfigFile;

if (!typescriptConfigExists) {
	core.fail(`Config file "tsconfig.json" doesn't exists in ${cwd}`);

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

core.info('"tsconfig.json" successfully parsed');

const
	typescriptProgram = ts.createProgram(config.fileNames, config.options);

core.info('Typescript program created');

const
	result = ts.getPreEmitDiagnostics(typescriptProgram);

core.info('Diagnostic complete');

let
	totalErrors = 0;

for (let i = 0; i < result.length; i++) {
	const
		d = result[i];

	if (d.category === ts.DiagnosticCategory.Error) {
		core.error(ts.formatDiagnostic(d, formatConfig));
		totalErrors++;
	}

	if (d.category === ts.DiagnosticCategory.Warning) {
		core.warning(ts.formatDiagnostic(d, formatConfig))
	}

	if (d.category === ts.DiagnosticCategory.Suggestion) {
		core.info(ts.formatDiagnostic(d, formatConfig));
	}
}

if (totalErrors) {
	core.setFailed(`Errors found: ${totalErrors}`);
}