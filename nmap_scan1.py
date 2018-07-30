#this command running on linux
import os

def get_nmap(options, ip):

	command = "nmap " + options + " " + ip
	process = os.popen(command)	#save value in memory

	result = process.read()

	return result

	return process
#print(get_nmap('-F', '54.186.250.79'))

try:
	while True:
		print('enter option: ')
		op = input()
		print()
		print('enter ip/domain: ')
		ipkey = input()
		print()
		print(get_nmap(op,ipkey))
		print()
except KeyboardInterrupt:
	pass	#cancel by ctrl + c
