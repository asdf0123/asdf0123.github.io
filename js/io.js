function parseString(str){
	str=str.replace(/^\s+|\s+$/gm,'');
	if(str.charAt(0)=="'"&&str.charAt(str.length-1)=="'")
		str=str.substr(1,str.length-2);
	else if(str.charAt(0)=="\""&&str.charAt(str.length-1)=="\"")
		str=str.substr(1,str.length-2);
	return str;
}
function parseArray(str){
	str=str.replace(/^\s+|\s+$/gm,'');
	str=str.replace(" ",'');
	if(str.charAt(0)=="["&&str.charAt(str.length-1)=="]")
		str=str.substr(1,str.length-2);
	str=str.split(",");
	var ret=new Array();
	if(str[0]=="")
		return ret;
	str.forEach(ele=>ret.push(parseInt(ele)));
	return ret;
}
function byte2hex(x,n=2){
	const s="0123456789abcdef";
	var ret="";
	for(let i=0;i<n||0<x;i++){
		ret=s.charAt(x&0xf)+ret;
		x>>=4;
	}
	return ret;
}
function arr2hex(x,n=2){
	var ret=new Array();
	for(let i=0;i<x.length;i++)
		ret.push(byte2hex(x[i],n));
	return ret.join(" ")
}
function hex2arr(x,n=2){
	x=x.replace(/[^0-9A-Fa-f]/g,"");
 	var ret=new Array();
	for(let i=0;i<x.length;i+=n)
		ret.push(parseInt(x.substr(i,n),16));
	return ret;
}
function str2arr(x){
	var ret=new Array();
	for(let i=0;i<x.length;i++)
		ret.push(x.charCodeAt(i)&0xff);
	return ret;
}
function arr2str(x){
	var flag=false;
	for(let i=0;i<x.length;i++)
		if(x[i]<0x20||0x7e<x[i]){
			flag=true;
			//x[i]=0x20;
		}
	return [String.fromCharCode.apply(null,x),flag];
}
