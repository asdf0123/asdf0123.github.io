function getbookinfo(){
	var bookinfos=new Map();
	//has somthing to do with reader.html
	bookinfos.set("wdkzs",["../json/EBook/wdkzs_index.json","`../EBook/wdkzs/wdkzs_volumn${voli}_chapter${chapi}.html`",[17,19,15,16,15,12,14,14,11,12,12,12,10,12,10,11,10,13,11,11,12]]);
	bookinfos.set("ppyx",["../json/EBook/ppyx_index.json","`../EBook/ppyx/ppyx_chapter${chapi}.html`",[189]]);
	bookinfos.set("slxh",["../json/EBook/slxh_index.json","`../EBook/slxh/slxh_chapter${chapi}.txt`",[712]]);
	bookinfos.set("bsjzdlbjl",["../json/EBook/bsjzdlbjl_index.json","`../EBook/bsjzdlbjl/bsjzdlbjl_chapter${chapi}.html`",[29]]);
	bookinfos.set("rasm",["../json/EBook/rasm_index.json","`../EBook/rasm/rasm_chapter${chapi}.html`",[36]]);
	bookinfos.set("lzywn",["../json/EBook/lzywn_index.json","`../EBook/lzywn/lzywn_chapter${chapi}.html`",[5]]);
	return bookinfos;
}
function parseurl(pathname){
	var m=new Map();
	para=pathname.split("?")[1];
	if(para==undefined)
		return m;
	para=para.split("&");
	var p;
	for(let i=0;i<para.length;i++){
		p=para[i].split("=");
		if(p.length<2)
			continue;
		if(p[0]=="id")
			m.set(p[0],p[1]);
		else
			m.set(p[0],parseInt(p[1]));
	}
	return m;
}
