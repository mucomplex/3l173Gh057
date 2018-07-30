import string
import itertools
import os
'''
usage:

value default:q
value length :9

shorter lenght value, longer the result will be.
'''

#input
default = input("value default:")
length  = input("value length :")
#default lenght is 12 - length default will result mutate value
mutate = 12 - int(length)
#get list upper and lowercase alphabet
list_alphabet = string.ascii_uppercase + string.ascii_lowercase

items = itertools.permutations(list_alphabet,mutate)
for item_list in items:
    result = ord(default)*int(length)
    for value in item_list:
        result += ord(value)
    if result == 1337:
        keygen = default*int(length) +''.join(item_list)
        print(keygen)
	# enable it to save to files.
        #os.system('echo %s >> keygen.txt' % str(keygen))
