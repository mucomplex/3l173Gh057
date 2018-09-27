key = input("Please enter a key:")
result = 0
for  number in range(len(key)):
	result += ord(key[number])
key = result
if (key == 1337):
	print(" Nice key :) ")
else:
	print("Bad Key :( ")
