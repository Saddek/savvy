version="3.1.0"
output="../savvy.js"

function clean {
	echo "Cleaning"
	rm -f $output
}

function compile {
	echo "Compiling using TypeScript" 
	tsc --out $output savvy.ts || exit -1
}

function compress {
	echo "Optomising using Google Closure" 

	# Read the js file
	js=$(<$output)

	# Google Closure Compiler API
	url="http://closure-compiler.appspot.com/compile"
	# WHITESPACE_ONLY, SIMPLE_OPTIMIZATIONS, ADVANCED_OPTIMIZATIONS
	level="SIMPLE_OPTIMIZATIONS"
	# text, json, xml
	format="text"
	# compiled_code, warnings, errors, statistics
	info="compiled_code"
	# compile using remote API
	code=$(curl --data-urlencode "js_code=$js" --data "compilation_level=$level&output_format=$format&output_info=$info" $url)
	# Write out
	echo "$code" > $output
}

function pretty {
	echo "Make pretty :-)"

	# Read the js file
	js=$(<$output)

	echo "/*" > $output
	cat banner.txt >> $output
	echo "Version: $version" >> $output
	cat MIT_license.txt >> $output
	echo "*/" >> $output
	echo "" >> $output
	echo "$js" >> $output
}

cat banner.txt

if [ "$1" = "--dev" ]; then
	clean
	compile
	pretty
else
	clean
	compile
	compress
	pretty
fi