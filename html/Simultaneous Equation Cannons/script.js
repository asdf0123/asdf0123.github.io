const matrix = document.getElementById("matrix");

function render_matrix(n, m, data/* shape=(n,m) */) {
	matrix.innerHTML = "";

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
				d.classList.add("hit");
				d.innerText = data_i_j.length;
				d.title = data_i_j.join("\n");
			}
			if (j + 1 == 12) {
				d.classList.add("right-divider");
			}
		}
	}
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
	const init_monsters = parse_int("init_monsters");
	if (Number.isNaN(init_monsters) || !(0 <= init_monsters && init_monsters <= 15)) {
		const msg = "子弹数不是合法整数";
		alert(msg);
		throw new Error(msg);
	}

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
		const extra_fusion_max_level = Math.max(Math.max(...extra_fusion), Math.max(...banished_fusion) ?? 0);
		const extra_xyz_max_rank = Math.max(Math.max(...extra_xyz), Math.max(...banished_xyz) ?? 0);

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