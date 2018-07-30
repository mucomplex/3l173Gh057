#this command running on linux
import os

def get_nmap(options, ip):

    command = "nmap " + options + " " + ip
    process = os.popen(command)

    result = str(process.read())

    return result

print(get_nmap('-F', '54.186.250.79'))
