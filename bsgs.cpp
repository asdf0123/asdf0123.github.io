
//#define sub0 1331169830894825846283645180578LL
//#define sub1 687055396590877856146397512559LL
#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<assert.h>
#include<map>
#include<string>
#include<iostream>
#define LEN 16
#define ll long long
#define mp(a,b) make_pair((a),(b))
#define pll pair<ll,ll>
//#define ord 1153763334005213LL
//#define MOD 1331169830894825846283645180581LL
using namespace std;
string byte2str(int x,int n=2){
	string chrset="0123456789abcdef";
	string ret=string("");
	while(x||n){
		ret=chrset[x&0xf]+ret;
		x>>=4;
		n--;
	}
	return ret;
}
struct Bigint{
	int byte[LEN];//mod 256
	Bigint(string str=string("")){
		memset(byte,0,sizeof(byte));
		int i,idx;
		if(str.length()&1)
			str=string("0")+str;
		for(i=0,idx=str.length()-2;idx>=0;i++,idx-=2)
			byte[i]=strtol(str.substr(idx,2).c_str(),NULL,16);
		return ;
	}
	~Bigint(){}
	bool operator < (const Bigint &rhs)const{
		int i;
		for(i=0;i<LEN&&byte[LEN-i-1]==rhs.byte[LEN-i-1];i++);
		return i<LEN&&byte[LEN-i-1]<rhs.byte[LEN-i-1];
	}
	bool operator == (const Bigint &rhs)const{
		int i;
		for(i=0;i<LEN&&byte[LEN-i-1]==rhs.byte[LEN-i-1];i++);
		return i==LEN;
	}
	Bigint operator + (const Bigint &rhs)const{
		int i;
		Bigint ret=Bigint();
		for(i=0;i<LEN;i++){
			ret.byte[i]+=byte[i]+rhs.byte[i];
			if(ret.byte[i]>=0x100){
				ret.byte[i+1]++;
				ret.byte[i]&=0xff;
			}
		}
		return ret;
	}
	Bigint operator - (const Bigint &rhs)const{
		int i;
		Bigint ret=Bigint();
		for(i=0;i<LEN;i++){
			ret.byte[i]+=byte[i]-rhs.byte[i];
			if(ret.byte[i]<0){
				ret.byte[i+1]--;
				ret.byte[i]&=0xff;
			}
		}
		return ret;
	}
	Bigint operator % (const Bigint &rhs)const{
		if(*this<rhs)
			return *this;
		return *this-rhs;
	}
	bool isZero()const{
		int i;
		for(i=0;i<LEN&&byte[i]==0;i++);
		return i==LEN;
	}
	void div2(){
		int i;
		byte[0]&=0xfe;
		for(i=0;i<LEN;i++){
			if(byte[LEN-i-1]&1)
				byte[LEN-i-2]+=0x100;
			byte[LEN-i-1]>>=1;
		}
		return ;
	}
	string hex()const{
		int i;
		string ret=("");
		for(i=0;i<16;i++)
			ret+=byte2str(byte[LEN-i-1]);
		return ret;
	}
}MOD,sub0,sub1;
inline Bigint fastmul(const Bigint& a,const Bigint& b){
	Bigint ret,acopy=a,bcopy=b;
	while(!bcopy.isZero()){
		//cout<<acopy.hex()<<"  "<<bcopy.hex()<<endl;
		if(bcopy.byte[0]&1)
			ret=(ret+acopy)%MOD;
		bcopy.div2();
		acopy=(acopy+acopy)%MOD;
	}
	return ret;
}
struct Poly{
	Bigint zero,one;
	Poly(Bigint one=Bigint(""),Bigint zero=Bigint("")):zero(zero),one(one){}
	~Poly(){}
	Poly operator*(const Poly&rhs)const{
		Bigint x,y,z;
		x=fastmul(zero,rhs.zero);
		/*cout<<zero.hex()<<endl;
		cout<<rhs.zero.hex()<<endl;
		cout<<x.hex()<<endl;*/
		y=(fastmul(one,rhs.zero)+fastmul(zero,rhs.one))%MOD;
		z=fastmul(one,rhs.one);
		return Poly((y+fastmul(z,sub1))%MOD,(x+fastmul(z,sub0))%MOD);
	}
	string hex()const{
		return one.hex()+string("*z2+")+zero.hex();
	}
};
inline Poly pow(const Poly &a,const ll &b){
	Poly ret=Poly(Bigint(""),Bigint("1")),acopy=a;
	ll expo=b;
	while(expo){
		if(expo&1)
			ret=ret*acopy;
		expo>>=1;
		acopy=acopy*acopy;
	}
	return ret;
}
#define LENP 13
struct node{
	unsigned char ctx[LENP*2];
	bool operator<(const node &rhs)const{
		int i;
		for(i=0;i<LENP*2;i++)
			if(ctx[i]^rhs.ctx[i])
				return ctx[i]<rhs.ctx[i];
		return 0;
	}
	bool operator==(const node &rhs)const{
		int i;
		for(i=0;i<LENP*2&&ctx[i]==rhs.ctx[i];i++);
		return i==LENP*2;
	}
};
node compress(Poly src){
	node ret;
	int i;
	for(i=0;i<LENP;i++)
		ret.ctx[i]=src.zero.byte[i];
	for(;i<LEN;i++)
		assert(src.zero.byte[i]==0);
	for(i=0;i<LENP;i++)
		ret.ctx[LENP+i]=src.one.byte[i];
	for(;i<LEN;i++)
		assert(src.one.byte[i]==0);
	return ret;
}
map<node,int>mm;
int main(){
/*
pp
qq
rr
0xf26b38e6594457a574e0c2877*z2 + 0xc7514875404b198b64e7b0956
0x1025d8c0eb70e93f597c37a9e1*z2 + 0xe68a0ba344244d3ceb5c6dc31
0x5aeec0d55ff63b3e9f3af59e9*z2 + 0x1323b450d61b292bff2bb4223
*/
//F2.modulus()=x^2 + 644114434303947990137247668022*x + 3
	ll p=0x4195775ada1ddLL,m=33967092;//m**2>p
	MOD=Bigint("10cd3de04a2aa57345a2b75aa5");
	sub0=MOD-Bigint("3");
	sub1=MOD-Bigint("8213ef8ea14a2a321b1d49736");
	Poly pp=Poly(Bigint("f26b38e6594457a574e0c2877"),Bigint("c7514875404b198b64e7b0956")),qq=Poly(Bigint("1025d8c0eb70e93f597c37a9e1"),Bigint("e68a0ba344244d3ceb5c6dc31")),rr=Poly(Bigint("5aeec0d55ff63b3e9f3af59e9"),Bigint("1323b450d61b292bff2bb4223"));
	
	cout<<pow(pp,p).hex()<<endl;
	/*
	pp**x=qq x=km-r, 1<=k<=m,0<=r<m
	*/
	int i,j;
	Poly tmp=pow(pp,m),t=Poly(Bigint(""),Bigint("1"));
	for(i=1;i<=m;i++){
		t=t*tmp;
		cout<<1.0*i/m<<"\r";
		mm[compress(t)]=i;
	}
	
	cout<<endl;
	tmp=pp;
	t=qq;
	node buf;
	for(i=0;i<m;i++){
		buf=compress(t);
		cout<<1.0*i/m<<"\r";
		if(mm.find(buf)!=mm.end()){
			cout<<endl;
			cout<<mm[buf]<<"FINDIT"<<i<<endl;
			break;
		}
		t=t*tmp;
	}
	return 0;
}
