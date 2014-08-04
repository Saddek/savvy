version="0.3.0"
output="../savvy.js"
declarations="../savvy.d.ts"
input="card.ts jxon.ts application.ts history.ts init.ts main.ts transitions.ts eval.ts"

function clean {
	echo "Preparing output files"
	rm -f $output
	rm -f $declarations
}

function compile {
	echo "Compiling using TypeScript" 
	tsc --declaration --target ES5 --out $output $input || exit -1
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
    # ECMASCRIPT3, ECMASCRIPT5, ECMASCRIPT5_STRICT
    language="ECMASCRIPT5_STRICT"
	# compile using remote API
	code=$(curl --data-urlencode "js_code=$js" --data "compilation_level=$level&output_format=$format&output_info=$info&language=$language" $url)
	# Write out
	echo "$code" > $output
}

function license {
	echo "Concatenating license and source"

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
	license
else
	clean
	compile
	compress
	license
fi