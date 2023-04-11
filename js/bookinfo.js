function getbookinfo(){
	var bookinfos=new Map();
	bookinfos.set("wdkzs",["../EBook/wdkzs/wdkzs_","volumn{}_chapter{}.html",[189]]);
	bookinfos.set("ppyx",["../EBook/ppyx/ppyx_","chapter{}.html",[17,19,15,16,15,12,14,14,11,12,12,12,10,12,10,11,10,13,11,11,12]]);
	bookinfos.set("slxh",["../EBook/slxh/slxh_","chapter{}.txt",[712]]);
	bookinfos.set("bsjzdlbjl",["../EBook/bsjzdlbjl/bsjzdlbjl_","chapter{}.html",[29]]);
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