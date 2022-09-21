SHELL     := /bin/sh

DIST_DIR  := dist
SRC_DIR   := src

SFLAGS     = --style=compressed
SFLAGS    += --no-source-map

SWFLAGS    = --watch

.PHONY: all

all: clean build

# Print the contents of a given variable within this file
print-% :
	$(info $* = $($*) ($(flavor $*))) @true


.PHONY:  help usage
.SILENT: help usage

help: usage

usage:
	printf "\\033[1mUSAGE:\\033[0m\\n\
	  make              Clean /dist and build\\n\
	  make build        Build HTML and plain-text files\\n\
	  make clean        Remove all files in /dist\\n\
	  make deploy       Push Git-tracked changes to server\\n\
	  make sass-live    Compile Sass to CSS, watching Sass files for changes\\n\
	  make print-VAR    Print the contents and flavor of a given variable VAR\\n\
	"


.PHONY:  build clean deploy sass sass-live
.SILENT: help sass


build: sass
	mkdir -p $(DIST_DIR)
	cp $(SRC_DIR)/index.html $(DIST_DIR)
	cp $(SRC_DIR)/playground.js $(DIST_DIR)
	cp -r $(SRC_DIR)/lib $(DIST_DIR)
	cp -r $(SRC_DIR)/assets $(DIST_DIR)

clean:
	rm -rf $(DIST_DIR)

deploy:
	git push server # Assume "server" is set up in SSH config

sass:
	mkdir -p $(DIST_DIR)
	sass $(SRC_DIR)/style.sass $(DIST_DIR)/style.css $(SFLAGS)
	echo "Compile CSS from Sass"

sass-live:
	mkdir -p $(DIST_DIR)
	sass $(SRC_DIR)/style.sass $(DIST_DIR)/style.css $(SFLAGS) $(SWFLAGS)
