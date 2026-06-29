const matrix = document.getElementById("matrix");
const suggestion = document.getElementById("suggestion");
const solution = document.getElementById("solution");

function clear_all() {
	matrix.innerHTML = "";
	suggestion.innerText = "";
	solution.innerText = "";
}
function render_suggestion(init_monsters) {
	const f=function(x){return x*(init_monsters-2*x);};
	const best_fusion_number = init_monsters / 4;// f 的对称轴
	let msg;
	if (Number.isInteger(best_fusion_number)) {
		const x0=best_fusion_number;
		msg = `子弹数为${init_monsters}时,最优超量数量为${x0*2},最优融合数量为${init_monsters - 2 * x0},初始射程有${f(x0)}种情况`;
	} else {
		const x1 = Math.floor(best_fusion_number);
		const x2 = Math.ceil(best_fusion_number);
		const best1_value = f(x1);
		const best2_value = f(x2);
		if(best1_value===best2_value){
			msg = `子弹数为${init_monsters}时,最优超量数量为${x1*2}/${x2*2},最优融合数量为${init_monsters - 2 * x1}/${init_monsters - 2 * x2},初始射程有${best1_value}种情况`;
		}
		else{
			const x0=best1_value>best2_value?x1:x2;
			msg = `子弹数为${init_monsters}时,最优超量数量为${x0*2},最优融合数量为${init_monsters - 2 * x0},初始射程有${f(x0)}种情况`;
		}
	}
	suggestion.innerText = msg;
}
function render_solution(n) {
	solution.innerText = `射程有${n}种情况`;
}
function render_matrix(n, m, data/* shape=(n,m) */) {

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

	function cell(i, j) {
		const d = document.createElement("div");
		d.className = "cell";
		d.id = `cell_${i}_${j}`;
		matrix.appendChild(d);
		return d;
	}

	let counter=0;
	// transpose and display
	cornerHeader("N", "M");
	for (j = 0; j < n; j++) {
		header(j + 1);
	}
	for (i = 0; i < m; i++) {
		header(i + 1);
		for (j = 0; j < n; j++) {
			const d = cell(j, i);
			const data_i_j = data[j][i];
			if (data_i_j.length > 0) {
				counter+=1;
				d.classList.add("hit");
				d.innerText = data_i_j.length;
				d.title = data_i_j.join("\n");
			}
			if (j + 1 == 12) {
				d.classList.add("right-divider");
			}
		}
	}
	render_solution(counter);
}
function parse_list(id) {
	return document.getElementById(id).value
		.split(",")
		.map(x => x.trim())
		.filter(x => x !== "")
		.map(Number);
}
function parse_int(id) {
	return Number(document.getElementById(id).value.trim());
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


	const extra_fusion = parse_list("extra_fusion");
	const extra_xyz = parse_list("extra_xyz");
	const banished_fusion = parse_list("banished_fusion");
	const banished_xyz = parse_list("banished_xyz");

	if (extra_fusion.length + extra_xyz.length + banished_fusion.length + banished_xyz.length != init_monsters) {
		const msg = `怪兽数量和预设的子弹数不一致(${extra_fusion.length}+${extra_xyz.length}+${banished_fusion.length}+${banished_xyz.length} ≠ ${init_monsters}),需要重新检查`;
		alert(msg);
		throw new Error(msg);
	}

	if (extra_fusion.length > 0 && extra_xyz.length > 0) {
		const extra_fusion_max_level = Math.max(...extra_fusion, ...banished_fusion);
		const extra_xyz_max_rank = Math.max(...extra_xyz, ...banished_xyz);

		const max_n = extra_fusion_max_level + extra_xyz_max_rank;
		const max_m = extra_fusion_max_level + extra_xyz_max_rank * 2;
		let vis = Array.from(
			{ length: max_n },
			() => Array.from(
				{ length: max_m },
				() => []
			)
		);

		const enumerate_extra_xyz = [...new Set(extra_xyz)].filter(x => extra_xyz.filter(y => y === x).length >= 2);

		for (const fusion_level of extra_fusion) {
			for (const xyz_rank of enumerate_extra_xyz) {
				const new_banished_fusion = [...banished_fusion, fusion_level];
				const new_banished_xyz = [...banished_xyz, xyz_rank, xyz_rank];//banish two
				const unique_new_banished_xyz = [...new Set(new_banished_xyz)];
				const y = fusion_level + xyz_rank * 2;
				for (const i of new_banished_fusion) {
					for (const j of unique_new_banished_xyz) {
						const x = i + j;
						vis[x - 1][y - 1].push(`banish ( L${fusion_level} + R${xyz_rank} * 2 ) and return ( L${i} + R${j} )`);
					}
				}
			}
		}
		render_matrix(max_n, max_m, vis);
		const msg = "计算成功";
		alert(msg);
	}
	else {
		const msg = "子弹不足开炮后不能除外";
		alert(msg);
		throw new Error(msg);
	}
};