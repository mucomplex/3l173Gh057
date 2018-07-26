class HTTP:

    def __init__(self, raw_data):
	#keep waiting for data to come across
	#receive it all & store in var named raw_data(real data that gonna be send to ethernet frame)
	#decode bytes to make string
        try:
            self.data = raw_data.decode('utf-8')
        except:
            self.data = raw_data
