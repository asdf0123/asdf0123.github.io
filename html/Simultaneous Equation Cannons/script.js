const matrix = document.getElementById("matrix");
const suggestion = document.getElementById("suggestion");
const solution = document.getElementById("solution");

function clear_all() {
	matrix.innerHTML = "";
	suggestion.innerText = "";
	solution.innerText = "";
}
function render_suggestion(init_monsters) {
	const f = function (x) { return x * (init_monsters - 2 * x); };
	const best_fusion_number = init_monsters / 4;// f 的对称轴
	let msg;
	if (Number.isInteger(best_fusion_number)) {
		const x0 = best_fusion_number;
		msg = `子弹数为${init_monsters}时,最优方案为(超量怪兽${x0 * 2}只,融合怪兽${init_monsters - 2 * x0}只),初始射程有${f(x0)}种情况`;
	} else {
		const x1 = Math.floor(best_fusion_number);
		const x2 = Math.ceil(best_fusion_number);
		const best1_value = f(x1);
		const best2_value = f(x2);
		if (best1_value === best2_value) {
			msg = `子弹数为${init_monsters}时,最优方案为(超量怪兽${x1 * 2}/${x2 * 2}只,融合怪兽${init_monsters - 2 * x1}/${init_monsters - 2 * x2}只),初始射程有${best1_value}种情况`;
		}
		else {
			const x0 = best1_value > best2_value ? x1 : x2;
			msg = `子弹数为${init_monsters}时,最优方案为(超量怪兽${x0 * 2}只,融合怪兽${init_monsters - 2 * x0}只),初始射程有${f(x0)}种情况`;
		}
	}
	suggestion.innerText = msg;
}
function render_solution(n) {
	solution.innerText = `射程有${n}种情况`;
}
function render_matrix(n, m, data/* shape=(n,m) */, fire_condition) {

	matrix.style.gridTemplateColumns = `80px repeat(${n},40px)`;

	function cornerHeader(row_name, col_name) {
		const d = document.createElement("div");
		d.className = "corner-header";

		// SVG
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("class", "corner-svg");
		svg.setAttribute("viewBox", "0 0 80 40");
		svg.setAttribute("preserveAspectRatio", "none");

		const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		line.setAttribute("x1", "0");
		line.setAttribute("y1", "0");
		line.setAttribute("x2", "80");
		line.setAttribute("y2", "40");
		line.setAttribute("stroke", "white");
		line.setAttribute("stroke-width", "2");

		svg.appendChild(line);

		// col label
		const col = document.createElement("span");
		col.className = "col-header";
		col.textContent = col_name;

		// row label
		const row = document.createElement("span");
		row.className = "row-header";
		row.textContent = row_name;

		d.appendChild(svg);
		d.appendChild(col);
		d.appendChild(row);

		matrix.appendChild(d);
	}

	// 表头
	function header(text) {
		const d = document.createElement("div");
		d.className = "header";
		d.innerText = text;
		matrix.appendChild(d);
	}

	function new_cell() {
		const d = document.createElement("div");
		d.className = "cell";
		matrix.appendChild(d);
		return d;
	}

	let counter = 0;
	// transpose and display
	cornerHeader("N", "M");
	for (j = 0; j < n; j++) {
		header(j + 1);
	}
	for (i = 0; i < m; i++) {
		header(i + 1);
		const default_flag = fire_condition.has(i + 1);
		for (j = 0; j < n; j++) {
			const d = new_cell();
			const data_i_j = data[j][i];
			if (data_i_j.length > 0) {
				counter += 1;
				d.classList.add("hit");
				d.innerText = data_i_j.length;
				d.title = data_i_j.join("\n");
			}
			else if (default_flag) {
				d.classList.add("misfire");
			}

			if (j + 1 == 12) {// 怪兽的等级·阶级的一般不超过12
				d.classList.add("right-divider");
			}
		}
	}
	render_solution(counter);
}
function parse_int(id) {
	const input = document.getElementById(id).value.trim();
	if (input === "") {
		return NaN;
	}
	else {
		return Number(input);
	}
}
function parse_fusion(prefix) {
	const ret = [];
	for (i = 0; i < 12; i++) {
		const id = `${prefix}_fusion_${i + 1}`;
		if (document.getElementById(id).checked) {
			ret.push(i + 1);
		}
	}
	return ret;
}
function parse_xyz(prefix) {
	const ret = [];
	for (i = 0; i < 13; i++) {
		for (const j of ["", "2"]) {
			const id = `${prefix}_xyz${j}_${i + 1}`;
			if (document.getElementById(id).checked) {
				ret.push(i + 1);
			}
		}
	}
	return ret;
}
document.getElementById("clac_button").onclick = function () {
	clear_all();
	const init_monsters = parse_int("init_monsters");
	if (Number.isNaN(init_monsters) || !(0 <= init_monsters && init_monsters <= 15)) {
		const msg = "子弹数不是合法整数";
		alert(msg);
		throw new Error(msg);
	}

	render_suggestion(init_monsters);

	const extra_fusion = parse_fusion("extra");
	const extra_xyz = parse_xyz("extra");
	const banished_fusion = parse_fusion("banished");
	const banished_xyz = parse_xyz("banished");

	if (extra_fusion.length + extra_xyz.length + banished_fusion.length + banished_xyz.length != init_monsters) {
		const msg = `怪兽数量和预设的子弹数不一致(${extra_fusion.length}+${extra_xyz.length}+${banished_fusion.length}+${banished_xyz.length} ≠ ${init_monsters}),需要重新检查`;
		alert(msg);
		throw new Error(msg);
	}
	else {

		if (extra_fusion.length > 0 && extra_xyz.length > 0) {
			const extra_fusion_max_level = Math.max(...extra_fusion, ...banished_fusion);
			const extra_xyz_max_rank = Math.max(...extra_xyz, ...banished_xyz);

			const max_n = extra_fusion_max_level + extra_xyz_max_rank;
			const max_m = extra_fusion_max_level + extra_xyz_max_rank * 2;
			const vis = Array.from(
				{ length: max_n },
				() => Array.from(
					{ length: max_m },
					() => []
				)
			);
			const fire_condition = new Set();

			const enumerate_extra_xyz = [...new Set(extra_xyz)].filter(x => extra_xyz.filter(y => y === x).length >= 2);

			for (const fusion_level of extra_fusion) {
				for (const xyz_rank of enumerate_extra_xyz) {
					const y = fusion_level + xyz_rank * 2;
					fire_condition.add(y);
					const new_banished_fusion = [...banished_fusion, fusion_level];
					const new_banished_xyz = [...banished_xyz, xyz_rank, xyz_rank];//banish two
					const unique_new_banished_xyz = [...new Set(new_banished_xyz)];
					for (const i of new_banished_fusion) {
						for (const j of unique_new_banished_xyz) {
							const x = i + j;
							vis[x - 1][y - 1].push(`banish ( L${fusion_level} + R${xyz_rank} * 2 ) and return ( L${i} + R${j} )`);
						}
					}
				}
			}
			render_matrix(max_n, max_m, vis, fire_condition);
		}
		else {
			const msg = "子弹不符合条件,无法开炮";
			alert(msg);
			throw new Error(msg);
		}
	}
};
document.getElementById("clear_button").onclick = function () {
	clear_all();
};