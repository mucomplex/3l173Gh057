
import socket
import struct
from general import *

#unpack ethernet frame
class Ethernet:

    def __init__(self, raw_data):
	#dest_mac == receiver, src_mac is sender, proto == type
        dest, src, prototype = struct.unpack('! 6s 6s H', raw_data[:14])
	#CONVERT DATA TO & FROM BYTE,we will just look to 1st 14 bytes
        self.dest_mac = get_mac_addr(dest)
        self.src_mac = get_mac_addr(src)
        self.proto = socket.htons(prototype)
        self.data = raw_data[14:]
	# these are fn to convert addr to human readable
	#note: data[14:]== data 14 to the en, grab data 14 to the end (payload is here)

