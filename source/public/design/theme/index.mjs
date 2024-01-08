
const PALETTE = [
	"#d97032", "#32b2d9", "#a732d9", "#6dd932",
	"#d9a432", "#3248d9", "#d9326c", "#32d973",
	"#e2a052", "#5294e2", "#e252dc", "#52e258",
	"#e36f52", "#52e3d6", "#8852e3", "#c2e352",
	"#e3c652", "#6d52e3", "#e35c52", "#52e3bc",
];

const STYLE = document.createElement("style");

export const update = () => {

	let APP = window.APP || null;
	let headers = Array.from(document.querySelectorAll("main > section header"));

	if (APP !== null && headers.length > 0) {

		let palette = {};
		let items = [];

		Object.keys(APP.Projects).sort().forEach((project, p) => {
			palette[project] = PALETTE[p % PALETTE.length];
			items.push("<li data-project=\"" + project + "\">" + project + "</li>");
		});

		headers.forEach((header) => {

			let list = header.querySelector("ul");
			if (list !== null) {
				list.innerHTML = items.join("");
			}

		});

		if (Object.keys(palette).length > 0) {

			let stylesheet = [];

			stylesheet.push("body {");
			Object.keys(palette).forEach((project) => {
				stylesheet.push("\t--project-" + project + "-text: #ffffff;");
				stylesheet.push("\t--project-" + project + "-background: " + palette[project] + ";");
				stylesheet.push("\t--project-" + project + "-border: " + palette[project] + ";");
			});
			stylesheet.push("}");

			Object.keys(palette).forEach((project) => {

				stylesheet.push("");
				stylesheet.push("main > section > header ul li[data-project=\"" + project + "\"].active {");
				stylesheet.push("\tcolor: var(--project-" + project + "-text);");
				stylesheet.push("\tbackground-color: var(--project-" + project + "-background);");
				stylesheet.push("}");

				stylesheet.push("");
				stylesheet.push("main > section#agenda article[data-project=\"" + project + "\"],");
				stylesheet.push("main > section#calendar article[data-project=\"" + project + "\"],");
				stylesheet.push("main > section#gantt article[data-project=\"" + project + "\"],");
				stylesheet.push("main > section#journal article[data-project=\"" + project + "\"] {");
				stylesheet.push("\tborder-color: var(--project-" + project + "-border);");
				stylesheet.push("}");

				stylesheet.push("");
				stylesheet.push("main > section#agenda article[data-project=\"" + project + "\"] h3 span[data-complexity],");
				stylesheet.push("main > section#calendar article[data-project=\"" + project + "\"] h3 span[data-complexity],");
				stylesheet.push("main > section#gantt article[data-project=\"" + project + "\"] h3 span[data-complexity],");
				stylesheet.push("main > section#journal article[data-project=\"" + project + "\"] h3 span[data-complexity] {");
				stylesheet.push("\tcolor: var(--project-" + project + "-text);");
				stylesheet.push("\tbackground-color: var(--project-" + project + "-background);");
				stylesheet.push("}");

			});

			STYLE.setAttribute("title", "Generated Project Color Palette");
			STYLE.innerHTML = stylesheet.join("\n");

			if (STYLE.parentNode === null) {
				document.head.appendChild(STYLE);
			}

		}

	}

};

