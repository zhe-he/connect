_all: all install start watch build server
.PHONY: _all

all: install
	webpack -w

install:
	cnpm install

start:
	webpack

watch:
	webpack -w 

build:
	webpack -p 

server:
	node server