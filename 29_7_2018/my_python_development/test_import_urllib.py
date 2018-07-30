import urllib.request
with urllib.request.urlopen('https://www.python.org/') as response:
	#html = response.read()
	html = str(response.read())

	pros = html.split("<img")

	#res = str(html.read())
	print(pros)
	print(type(pros))
