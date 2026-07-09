@ECHO OFF
Powershell.exe -Command "cd %~dp0Api; & {Start-Process Powershell.exe -Verb RunAs -ArgumentList 'dotnet run'}"
Powershell.exe -Command "cd %~dp0..\hoptructuyen-sso-backend-qtht\HTT_QTHT; & {Start-Process Powershell.exe -Verb RunAs -ArgumentList 'dotnet run --launch-profile https'}"
exit