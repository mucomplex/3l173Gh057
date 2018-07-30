# python_development
python development

DATA TYPE:-

a)Number(int,float/double)

#check if a no is a multiple of 3. if it is, also check if it is a multiple of 7
#6 % 3 = 0; 10 % 3 = 2;

print("Enter a number: ")
number = int(input()) # input funtion by default read the value as string, so need to cast
if number % 3 is 0:
    print("Number is multiple of 3")
    if number % 7 is 0:
        print("Number is also multiple of 7")
    else:
        print("Number is multiple of 3 but not 7")


b)String

w = "lets.SPLIT.the_string.192.168.1.8"
print("Copy string in lowercase: ")
print(w.lower())
print("Split function: ")
print(w.split("."))

c)List  @Square bracket []

#listName = [obj1, obj2, obj3]
>>> favfruit = ["apple", "mango", "berry"]
>>> favfruit = [0]
    'apple'
>>> favfruit[1] = "orange"
>>> favfruit
    ['apple', 'orange', 'berry']
    
#list.append() --> add element on the last index
#list.insert() --> add element on specific position (1, "orange")
#list.remove() --> must be in paranthesis eg: favfruit.remove("berry")
#list.sort() --> sorting by alpha...

d)Tuple  @Bracket ()

#Tuple is a collection of obj that can't be replace.
eg:-
>>>historicWarDate = (1914, 1939)
>>>historicWarDate[0]
   1914
>>>del(historicWarDate)

#dont have repleace by have delete

e)Dictionary @Curly bracket {}
#is a collection of key and value in list
#format as below:

#dictionaryName = {key1 : value1, key2 : value2}

>>>priceOfCamera = {"sony":500, "nikon":600, "canon":700}
