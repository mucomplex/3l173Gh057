import struct

#unpack IPv4 packet
class IPv4:

    def __init__(self, raw_data):
        version_header_length = raw_data[0]\
	#bitwise operation, compare 2 bytes,gonna get result when both bytes are 1
        self.version = version_header_length >> 4
	#header length determine where the data start,right after header ends,data begins
        self.header_length = (version_header_length & 15) * 4
	#unpack everything
        self.ttl, self.proto, src, target = struct.unpack('! 8x B B 2x 4s 4s', raw_data[:20])
        self.src = self.ipv4(src)
        self.target = self.ipv4(target)
        self.data = raw_data[self.header_length:]
	#note:: IP packet is broken up into header & the actual data

    # Returns properly formatted IPv4 address
    def ipv4(self, addr):
        return '.'.join(map(str, addr))
