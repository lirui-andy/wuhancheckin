@echo off
@rem input your email here. Do not input space after the =
set email=liruiwh@cn.ibm.com
@rem input your serial here. Do not input space after the =
set serial=044733


if not defined email (
	echo Please edit sign-wh.bat with Notepad.exe and input your email and serial correctly.
	pause
	goto e
) 
if not defined serial (
	echo Please edit sign-wh.bat with Notepad.exe and input your email and serial correctly.
	pause
	goto e
) 

cd %~p0
echo Sign for %email% %serial%
echo ---------------
curl -s -d "email=%email%" http://9.110.168.184:8080/schedule/doLogin -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.15063" >>nul

echo request sent.


for /f "tokens=1-4 delims=-/\:. " %%a in ("%date%") do (set y=%%d&&set m=%%b&&set d=%%c)
echo Checking status for %y%-%m%-%d% ...
curl -o res.json -s http://9.110.168.184:8080/schedule/getStatus/%serial%


set regex="%y%[\-]%m%[\-]%d%[^{]*statusCode.*:1"

@rem echo %regex%
findstr /R %regex% res.json > nul

IF ERRORLEVEL 1 goto 1 
IF ERRORLEVEL 0 goto 0 

:0 
echo SUCCESS!
pause
goto e 

:1 
echo  >>>Faild please check mannually.<<<
start http://9.110.168.184:8080/schedule/doLogin
pause
goto e 

:e


