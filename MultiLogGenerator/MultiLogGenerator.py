import random
from random import randrange
import datetime
from datetime import datetime
from pytz import timezone
import os
from time import sleep


# generate log entries
def logEntriesGenerator():
    siteName = "saferide.nagkumar.com:80"
    ipAddr = randomIPGenerator()
    dashes = "- - "
    d = datetime.now()
    dateTime = '[' + d.strftime("%d/%b/%Y:%H:%M:%S +0000") + ']'  # [18/Apr/2016:10:58:08 +0000]
    requestMessage = [
        '"POST /admin/login/?next=/admin/ HTTP/1.1"',
        '"GET /manager/html HTTP/1.1"',
        '"GET /static/admin/fonts/Roboto-Bold-webfont.woff HTTP/1.1"',
        '"GET http://testp3.pospr.waw.pl/testproxy.php HTTP/1.1"',
        '"GET /sitemap.xml HTTP/1.1"',
        '"GET / HTTP/1.1"',
        '"GET /robots.txt HTTP/1.1"',
        '"GET http://testp1.piwo.pila.pl/testproxy.php HTTP/1.1"',
        '"HEAD /redirect.php HTTP/1.0"',
        '"GET http://www.mafengwo.cn/ HTTP/1.1"',
        '"HEAD / HTTP/1.1"',
        '"GET http://testp4.pospr.waw.pl/testproxy.php HTTP/1.1"',
        '"GET /muieblackcat HTTP/1.1"',
        '"GET //phpMyAdmin/scripts/setup.php HTTP/1.1"',
        '"GET //pma/scripts/setup.php HTTP/1.1"',
        '"GET //myadmin/scripts/setup.php HTTP/1.1"',
        '"GET //Myadmin/scripts/setup.php HTTP/1.1"',
        '"GET http://testp5.mielno.lubin.pl/testproxy.php HTTP/1.1"',
        '"GET /zecmd/zecmd.jsp?comment=id HTTP/1.0"',
        '"CONNECT www.baidu.com:443 HTTP/1.1"',
        '"POST /request_ride/ HTTP/1.1"',
        '"GET /phpmyadmin/scripts/setup.php HTTP/1.1"',
        '"GET /static/rest_framework/css/bootstrap.min.css HTTP/1.1"',
        '"GET /static/admin/fonts/Roboto-Regular-webfont.woff HTTP/1.1"',
        '"GET /static/admin/css/fonts.css HTTP/1.1"',
        '"GET /static/admin/css/login.css HTTP/1.1"',
        '"GET /static/admin/css/base.css HTTP/1.1"'
    ]
    logRequestMessage = random.choice(requestMessage)
    status = [200, 202, 204, 300, 301, 302, 400, 401, 404, 407, 408, 500, 502, 504]
    logStatus = random.choice(status)
    size = [1371, 168, 58, 195, 234, 235, 256, 262, 327, 360, 434, 485, 725, 821, 931, 1088, 1134, 1280, 1594, 1595,
            1742, 4024, 4676, 4677, 4703, 6375, 10095, 20221, 33632, 80605, 81649, 82865]
    logSize = random.choice(size)
    webPageAccessed = [
        '"http://saferide.nagkumar.com/admin/login/?next=/admin/"',
        '-',
        '"http://saferide.nagkumar.com/static/rest_framework/css/bootstrap-tweaks.css"',
        '"http://saferide.nagkumar.com/"'
    ]
    logWebPageAccessed = random.choice(webPageAccessed)
    machineInfo = [
        '"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36"',
        '"Mozilla/5.0 (Windows NT 5.1; rv:32.0) Gecko/20100101 Firefox/31.0"',
        '"Mozilla/3.0 (compatible; Indy Library)"',
        '-',
        '"Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)"',
        '"Research scan, mail networkresearch@yandex.ru"',
        '"www.probethenet.com scanner"',
        '"Mozilla/5.0 (compatible; Nmap Scripting Engine; http://nmap.org/book/nse.html)"',
        '"Wget(linux)"',
        '"ZmEu"'
    ]
    logMachineInfo = random.choice(machineInfo)
    space = ' '
    logEntry = siteName + space + ipAddr + space + dashes + space + dateTime + space + logRequestMessage + space + str(
        logStatus) + space + str(logSize) + space + logWebPageAccessed + space + logMachineInfo + space
    print(logEntry)
    return logEntry


# generates random IP
def randomIPGenerator():
    not_valid = [10, 127, 169, 172, 192]
    first = randrange(0, 99)

    while first in not_valid:
        first = randrange(0, 255)
    ip = ".".join([str(first), str(randrange(0, 255)),
                   str(randrange(0, 255)), str(randrange(0, 255))])
    print(ip)
    return ip
    # blockOne = randrange(0, 99, 1)
    # blockTwo = randrange(0, 99, 1)
    # blockThree = randrange(0, 99, 1)
    # blockFour = randrange(0, 99, 1)
    # print 'Random IP: ' + str(blockOne) + '.' + str(blockTwo) + '.' + str(blockThree) + '.' + str(blockFour)
    # if blockOne == 10:
    #     return self.__generateRandomIP__()
    # elif blockOne == 172:
    #     return self.__generateRandomIP__()
    # elif blockOne == 192:
    #     return self.__generateRandomIP__()
    # else:
    #     return str(blockOne) + '.' + str(blockTwo) + '.' + str(blockThree) + '.' + str(blockFour)


# return socket.inet_ntoa(struct.pack('>I', random.randint(1, 0xffffffff)));


# write it to the log
def writeToTheLog(log, logFile):
    logFile.write(log)
    logFile.write("\n")


# Running logEntriesGenerator and writeToTheLog multiple times asynchronously.
def multipleConcurrentWrite():
    fileName = '..\\logs\\access.log'
    remove_chars = len(os.linesep)
    cur_path = os.getcwd()
    new_path = os.path.relpath(fileName, cur_path)

    i = 0
    while True:
        logFile = open(new_path, 'a')
        writeToTheLog(logEntriesGenerator(), logFile)
        i = i + 1
        print(i)
        # sleep(0.5)
        logFile.close()


if __name__ == "__main__":
    multipleConcurrentWrite()
