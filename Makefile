
MONO_DEBUG_RELEASE = "./bin/Release/mono-debug.exe"
MONO_DEBUG_DEBUG = "./bin/Debug/mono-debug.exe"

all: vsix
	@echo "vsix created"

vsix: $MONO_DEBUG_RELEASE
	./node_modules/.bin/vsce package

publish: $MONO_DEBUG_RELEASE
	./node_modules/.bin/vsce publish

build: $MONO_DEBUG_RELEASE
	node_modules/.bin/tsc -p ./src/typescript
	@echo "build finished"

debug: $MONO_DEBUG_DEBUG
	node_modules/.bin/tsc -p ./src/typescript
	@echo "build finished"

$MONO_DEBUG_RELEASE:
	msbuild /v:minimal /restore /p:Configuration=Release src/csharp/mono-debug.csproj

$MONO_DEBUG_DEBUG:
	msbuild /v:minimal /restore /p:Configuration=Debug src/csharp/mono-debug.csproj

tests:
	cd testdata/simple; make
	cd testdata/output; make
	cd testdata/simple_break; make
	cd testdata/fsharp; make

run-tests: tests
	node_modules/.bin/mocha --timeout 10000 -u tdd ./out/tests

lint:
	node_modules/.bin/eslint . --ext .ts,.tsx

watch:
	node_modules/.bin/tsc -w -p ./src/typescript

clean:
	git clean -xfd