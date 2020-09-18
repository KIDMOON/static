echo 'Start to build project'
@echo off

set MAVEN_OPTS=-Xms128m -Xmx512m -Dfile.encoding=UTF-8

call mvn clean install -DskipTests -Denv=qa

@echo on
pause