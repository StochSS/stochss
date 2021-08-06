@echo off
set DEFAULT_WORKING_DIR=%cd%\local_data

if [%1]==[] (set WORKING_DIR=%DEFAULT_WORKING_DIR%) else (set WORKING_DIR=%1)
if exist %WORKING_DIR% goto examples
mkdir %WORKING_DIR%

:examples
if exist %WORKING_DIR%\Examples goto end
xcopy %cd%\public_models %WORKING_DIR%\Examples\ /E/H

:end
