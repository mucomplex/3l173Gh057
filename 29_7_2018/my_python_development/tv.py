#testing excercise by MrCa$h

class TV(): #This line is for creating class
    
    
    def __init__(self,tv1,tv2,tv3): #this line is for creating constructor
        self.tv1=tv1
        self.tv2=tv2
        self.tv3=tv3
        
    def changeTV1(self): # this line is for creating function changeTV1 , and then check if the argment supplied is matched with the condition or not, and eventually print the result.
        if (self.tv1 == "switch"): 
            print("TV1 is switched!")
        else:
            print("TV1 is not switched!")
        
    def changeTV2(self): # this line is for creating function changeTV2 , and then check if the argment supplied is matched with the condition or not, and eventually print the result.
        if (self.tv2 == "switch"):
            print("TV2 is switched!")
        else:
            print("TV2 is not switched!")        
            
    def changeTV3(self):  # this line is for creating function changeTV3 , and then check if the argment supplied is matched with the condition or not, and eventually print the result.
        if (self.tv3 == "switch"):
            print("TV3 is switched!")
        else:
            print("TV3 is not switched!")
            
    def upgrade1(self): # this line is for creating function upgrade1 . and then check if the argument supplied for tv1 and tv2 are integers. Afterwards, add the integers and then print the customized output.
        if (int(self.tv1) and int(self.tv2)):
            upgrade = str(self.tv1 + self.tv2)
            print("Your TV is upgraded to TV"+ upgrade)
        else:
            print("Nothing is upgraded.")
def usage(): # this line is for creating usage function, which display the format for arguments to be supplied.
    print("Usage: switch_channel(<switch/don't/integer>,<switch/don't/integer>,<switch/don't/integer>")
    
#usage()
#this is for asking the name of user.
name=input("This is for fun. What's your name? ===>") 
           


change_tv=TV(5, 2, "switch")
change_tv.changeTV1()
change_tv.changeTV2()
change_tv.changeTV3()
change_tv.upgrade1()
print("Thank you for using this program, ", name, "!") #this line is for displaying the string and name value
