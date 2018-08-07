import random
import sys

print("You gotta wait to make it happen :D")

def c_key(key):
    char_sum=0
    for c in key:
            char_sum += ord(c)
    sys.stdout.write("{0:3} | {1}       \r".format(char_sum, key))
    ## to make it look cool
    return char_sum

key=""
while True:
    key = ''.join(random.choice("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890-_") for i in range(12))
    ##this will generate a random number with string length '12'
    s = c_key(key)
    if s>1337:
        key=""
    elif s==1337:
        print("Found valid key: {0}".format(key))
