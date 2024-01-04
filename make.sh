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

	cd "${ROOT}/source";

	if [[ "$ext" != "" ]]; then
		env GOOS="${os}" GOARCH="${arch}" ${GO} build -o "${folder}/${os}-${arch}.${ext}" "${ROOT}/source/cmds/agenda/main.go";
	else
		env GOOS="${os}" GOARCH="${arch}" ${GO} build -o "${folder}/${os}-${arch}" "${ROOT}/source/cmds/agenda/main.go";
	fi;

	if [[ "$?" == "0" ]]; then
		echo -e "- Build $os / $arch [\e[32mok\e[0m]";
	else
		echo -e "- Build $os / $arch [\e[31mfail\e[0m]";
	fi;

}


if [[ "$GO" != "" ]]; then

	build "linux" "amd64";

else
	echo "Please install go(lang) compiler.";
	exit 1;
fi;

