import os
import sys

#define class with name calculator
class calculator():
    #constructor untuk class calculator
    ''' value yang diletakkan semasa memanggil class calculator akan dimasukkan ke constructor,
        contoh nombor 10 dimasukkan ke value1 , nombor 5 dimasukkan ke value2 . 
        kemudian value1 dimasukkan ke self.value1 , dan value2 dimasukkan ke self.value2 '''
    def __init__(self,value1,value2):
        self.value1=value1
        self.value2=value2
    '''setiap value yang dipanggil daripada function diambil dari constructor, jadi kita tidak perlu letak value lagi'''
    def addition(self):
        result=self.value1 + self.value2
        print("tambah dua nilai %s" % str(result))

    def subtraction(self):
        result=self.value1 - self.value2
        print("nilai1 - nilai2: %s" % str(result))

#cara memanggil class dan insert value
my_calculator = calculator(10,5)
#cara memanggil function didalam class
my_calculator.addition()
my_calculator.subtraction()
