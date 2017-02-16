#!/bin/bash

export NODE_ENV=production
babel src/backend/ -d dist --source-maps
