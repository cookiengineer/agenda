#!/bin/bash

GO="$(which go)";
ROOT="$(pwd)";



build() {

	local os="$1";
	local arch="$2";
	local folder="${ROOT}/build/${os}";

	local ext="";

	if [[ "$os" == "windows" ]]; then
		ext="exe";
	fi;

	mkdir -p "$folder";

	cd "${ROOT}";

	if [[ "$ext" != "" ]]; then
		env GOOS="${os}" GOARCH="${arch}" ${GO} build -o "${folder}/${os}-${arch}.${ext}" "${ROOT}/agenda.go";
	else
		env GOOS="${os}" GOARCH="${arch}" ${GO} build -o "${folder}/${os}-${arch}" "${ROOT}/agenda.go";
	fi;

	if [[ "$?" == "0" ]]; then
		echo -e "- Build $os / $arch [\e[32mok\e[0m]";
	else
		echo -e "- Build $os / $arch [\e[31mfail\e[0m]";
	fi;

}



if [[ "$GO" != "" ]]; then

	# build "android" "arm";
	build "android" "arm64";

	build "darwin" "amd64";
	build "darwin" "arm64";

	# build "linux" "386";
	build "linux" "amd64";
	build "linux" "arm";
	build "linux" "arm64";

	# build "windows" "386";
	build "windows" "amd64";
	# build "windows" "arm";
	# build "windows" "arm64";

else
	echo "Please install go(lang) compiler.";
	exit 1;
fi;

