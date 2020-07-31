the basic plan is to inspect the abstract syntax tree to find where variables are being assigned.

Furthermore, we want to be able to track when those variables are being logged or somehow exposed from the black box

Eventually, this should result in some kind of observability metric for the codebase and possibly for individual files

###

next steps
ensure it is able to tell the difference between a console.log and any other function call
ensure it is able to not die when a console log is done of a variable imported from another module

####

next steps
ensure it is able to recognise parameters passed into functions and can match them to observations
