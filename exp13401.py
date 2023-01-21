import random
import gmpy2
import numpy as np
from Crypto.Util.number import isPrime
from math import log
from os import system
digit="0123456789"
lowercase="abcdefghijklmnopqrstuvwxyz"
uppercase="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
charset='13579ACEGIKMOQSUWY_acegikmoqsuwy'
ULLMAX=0xffffffffffffffff
MOD=1<<64

S=ord("1")+ord("a")+ord("A")
#S=1123
#S=1453 #tobe searched
def nextPrime(n):
	n += 2 if n & 1 else 1
	while not isPrime(n):
		n += 2
	return n

globalset=None
#revglobalset=None
#rev={}
def check():
	array = np.array(list(map(ord, password)))
	return isPrime(int(array.sum())) and array.sum() == array.prod()
def genmask(char):
	if char in digit:
		return 1
	elif char in lowercase:
		return 2
	elif char in uppercase:
		return 4
	else:
		return 0
#def init():
#	global S,globalset
#	globalset=tuple(tuple(set() for j in range(8)) for i in range(S//2+1))
#	globalset[0][0].add(1)
#	for i in range(S//2+1):
#		for state in range(8):
#			for ch in charset:
#				if i+ord(ch)>S//2:
#					break
#				for ele in globalset[i][state]:
#					globalset[i+ord(ch)][state|genmask(ch)].add((ele*ord(ch))&ULLMAX)
#	for ch in charset:
#		rev[ch]=gmpy2.invert(ord(ch),ULLMAX+1)
#	return 
#def chk():
#	global S,globalset,revglobalset
#	cnt=0
#	revglobalset=tuple(tuple(set() for j in range(8)) for i in range(S//2+1))
#	revglobalset[0][0].add(S)
#	for i in range(S//2+1):
#		for state in range(8):
#			for ch in charset:
#				if i+ord(ch)<=S//2:
#					for ele in revglobalset[i][state]:
#						revglobalset[i+ord(ch)][state|genmask(ch)].add((ele*rev[ch])&ULLMAX)
#				else:
#					for ele in revglobalset[i][state]:
#						for originstate in range(8):
#							if (originstate|state|genmask(ch))<7:
#								continue
#							if ((ele*rev[ch])&ULLMAX) in globalset[S-i-ord(ch)][originstate]:
#								print(i,state,ch,ele,originstate,S)
#								return True
#							else:
#								cnt+=1
#	print("cnt={} log={}".format(cnt,log(cnt)/log(2)))
#	system("date")
#	return False
#def loop():
#	global S,globalset
#	delta=nextPrime(S)-S
#	globalset=tuple(globalset+tuple(tuple(set() for j in range(8)) for i in range(delta//2)))
#	S+=delta
#	for i in range(max(0,S//2-ord(charset[-1])),S//2+1):
#		for state in range(8):
#			for ch in charset:
#				if i+ord(ch)<=(S-delta)//2:
#					continue
#				if i+ord(ch)>S//2:
#					break
#				for ele in globalset[i][state]:
#					globalset[i+ord(ch)][state|genmask(ch)].add((ele*ord(ch))&ULLMAX)
	
bridge=[]
def init():
	global S,globalset,bridge
	globalset=list(tuple(set() for j in range(8)) for i in range(S//2+1))
	globalset[0][0].add(1)
	for i in range(S//2+1):
		for state in range(8):
			for ch in charset:
				if i+ord(ch)>S//2:
					bridge.append((i,state,ch))
					continue
				for ele in globalset[i][state]:
					globalset[i+ord(ch)][state|genmask(ch)].add((ele*ord(ch))&ULLMAX)
	return 
def chk():
	global S,globalset,bridge
	cnt=0
	for (i,state,ch) in bridge:
		for ele in globalset[i][state]:
			for originstate in range(8):
				if (originstate|state|genmask(ch))<7:
					continue
				if (S*gmpy2.invert((ele*ord(ch))&ULLMAX,ULLMAX+1))&ULLMAX in globalset[S-i-ord(ch)][originstate]:
					return (i,state,ch,ele,originstate)
				else:
					cnt+=1
	print("cnt={} log={}".format(cnt,log(cnt)/log(2)))
	system("date")
	return
def loop():
	global S,globalset,bridge
	delta=nextPrime(S)-S
	globalset=globalset+list(tuple(set() for j in range(8)) for i in range(delta//2))
	S+=delta
	bridge=[]
	for i in range(max(0,S//2-ord(charset[-1])),S//2+1):
		for state in range(8):
			for ch in charset:
				if i+ord(ch)<=(S-delta)//2:
					continue
				if i+ord(ch)>S//2:
					bridge.append((i,state,ch))
					continue
				for ele in globalset[i][state]:
					globalset[i+ord(ch)][state|genmask(ch)].add((ele*ord(ch))&ULLMAX)
	
if __name__=="__main__":
	init()
	while True:
		assert(isPrime(S))
		print(S)
		buf=chk()
		if buf is not None:
			break
		else:
			loop()

	print(buf)
	(i,state,passwd,ele,originstate)=buf
	assert(((ele*rev[passwd])&ULLMAX) in globalset[S-i-ord(passwd)][originstate])
	eleinglobalset=((ele*rev[passwd])&ULLMAX)
	newi=S-i-ord(passwd)
	state=originstate
	while newi:
		assert(eleinglobalset in globalset[newi][state])
		buf=None
		for ch in charset:
			if ord(ch)>newi:
				break
			if buf:
				break
			if ((eleinglobalset*rev[ch])&ULLMAX) in globalset[newi-ord(ch)][state]:
				buf=(ch,state)
			elif ((eleinglobalset*rev[ch])&ULLMAX) in globalset[newi-ord(ch)][state&(7^genmask(ch))]:
				buf=(ch,state&(7^genmask(ch)))
		assert(buf)
		passwd=buf[0]+passwd
		newi,state,eleinglobalset=newi-ord(buf[0]),buf[1],((eleinglobalset*rev[buf[0]])&ULLMAX)
	
	#(i,state,soy,ele,originstate)=buf#(414,1,50911590027375,6,1063)
	#eleinglobalset=ele
	#newi=i
	#while newi:
	#	assert(eleinglobalset in revglobalset[newi][state])
	#	buf=None
	#	for ch in charset:
	#		if ord(ch)>newi:
	#			break
	#		if buf:
	#			break
	#		if ((ele*ord(ch))&ULLMAX) in revglobalset[newi-ord(ch)][state]:
	#			buf=(ch,state)
	#		elif ((ele*ord(ch))&ULLMAX) in revglobalset[newi-ord(ch)][state&(7^genmask(ch))]:
	#			buf=(ch,state&(7^genmask(ch)))
	#	assert(buf)
	#	passwd=passwd+buf[0]
	#	newi,state,eleinglobalset=newi-ord(buf[0]),buf[1],((ele*ord(buf[0]))&ULLMAX)
	print(passwd)
