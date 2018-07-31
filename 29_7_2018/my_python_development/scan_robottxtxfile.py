#robot.txt file is to avoid from sensitive/pivate info(admin/cpanel/db) being crawl by google/yahoo

import urllib.request   #make request from url like GET and download files from internet
import io               #ensure it is readable

def get_robot_txt(url):

    if url.endswith('/'):
        path = url
    else:
        path = url + '/'

    req = urllib.request.urlopen(path + "robot.txt", data + None)
    data = io.TextIOWrapper(req, encoding = 'utf-8')

    return data.read()

print(get_robot_txt('https://www.reddit.com'))
