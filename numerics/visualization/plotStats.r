#!/usr/bin/Rscript --vanilla

# plot means and standard deviations
# indices is a vector of species indices to plot

# Example to run the function from $STOCHKIT_HOME after running dimer decay example
# plotStats.r models/examples/dimer_decay_output/stats 1 2 3
# where "1 2 3" specifies printing species indexes 1,2 and 3

# Process command line arguments
args.vec <- commandArgs(TRUE)
if(length(args.vec) < 2) { stop("Usage: plotStats.r inputFileDirectory(CHARACTER) outputFile(CHARACTER) [indices](NUMERIC)") }
inputFileDirectory <- args.vec[1]
outputFile <- args.vec[2]
if(length(args.vec) >= 3) {
  indices <- as.numeric(args.vec[3:length(args.vec)])
} else {
  indices <- NULL
}

# Color vector
colors <- c("blue","red","green","magenta","cyan","black","yellow","lightgreen","purple","deeppink")

# Build full inpute file names
fnameMean <- paste(inputFileDirectory,"means.txt",sep="/")
fnameVar <- paste(inputFileDirectory,"variances.txt",sep="/")

# Read in the means.txt data
mheader <- read.table(fnameMean,as.is=TRUE,nrows=1)
if(any(sapply(mheader,is.character))) {
  mheader <- as.character(mheader)
  mdata <- as.matrix(read.table(fnameMean,as.is=TRUE,skip=1))
} else {
  mheader <- ""
  mdata <- as.matrix(read.table(fnameMean,as.is=TRUE))
}

# Read in the variances.txt data
vheader <- read.table(fnameVar,as.is=TRUE,nrows=1)
if(any(sapply(vheader,is.character))) {
  vheader <- as.character(vheader)
  vdata <- as.matrix(read.table(fnameVar,as.is=TRUE,skip=1))
} else {
  vheader <- ""
  vdata <- as.matrix(read.table(fnameVar,as.is=TRUE))
}

# Check and process indices
if(!is.null(indices)) {
  # Check to make sure that the indices are integers
  if(!all.equal(as.integer(indices), indices)) { stop("need integer indices") }

  # Check to make sure that the indices are greater than 0
  if(any(indices <= 0)) { stop("indices need to be positive integers") }

  # Check to eliminate duplicate indices
  if(any(isDuplicated <- duplicated(indices))) {
    cat(paste("removing ",sum(isDuplicated)," duplicate indices...\n",sep=""))
    indices <- unique(indices)
  }

  # Add 1 to account for the time column; sort indices
  indices <- indices + 1
  indices <- sort(indices)

  # Check to make sure indices are within range
  if(indices[length(indices)] > ncol(mdata)) { stop(paste("indices must be less than or equal to ",ncol(mdata)-1,sep="")) }
} else {
  # Populate indices if empty
  indices <- 2:ncol(mdata)
}
len_indices <- length(indices)

# Check equality of mean and variance headers
if(!all(mheader == vheader)) { stop("ERROR: mean and variance should have identical labels") }

# Extract and check equality of mean and variance time points
mtimes <- mdata[,1]
vtimes <- vdata[,1]
if(!all(mtimes == vtimes)) { stop("ERROR: mean and variance should have the same time points") }

# Extract means, variances, and upper/lower confidence intervals
means <- mdata[,indices,drop=FALSE]
vars <- vdata[,indices,drop=FALSE]
mupper <- means + sqrt(vars)
mlower <- means - sqrt(vars)

# Create plot labels
if((length(mheader)==1) && (mheader=="")) {
  labels <- paste("Index",indices-1,sep=" ")
} else {
  labels <- mheader[indices]
}

# Make plots
png(outputFile,width=1200,height=900)
par(xaxs="i",yaxs="i",oma=c(2.5,4,1,3),mar=c(4,7,4,5))
if(length(mtimes) == 1) {
  xlim <- c(mtimes[1]*.9, mtimes[1]*1.1)
} else {
  xlim <- c(mtimes[1], mtimes[length(mtimes)])
}
if(len_indices > length(colors)) { colors <- c(colors,sample(colors(),len_indices-length(colors))) }
plot(NA, NA, xlim=xlim, ylim=range(c(mupper,mlower)), xlab="", ylab="", main="stats plot", cex.main=2.25, axes=FALSE)
axis(1,tck=.01,cex.axis=1.75)
axis(2,tck=.01,cex.axis=1.75,las=2,hadj=.8)
axis(3,labels=FALSE,tck=.01)
axis(4,labels=FALSE,tck=.01)
box()
mtext(side=1,text="time",cex=2.25,line=3)
mtext(side=2,text="population",cex=2.25,line=5)
for(i in 1:len_indices) {
  points(mtimes, means[,i], col=colors[i], type="l", lty=1, lwd=4)
  points(mtimes, mupper[,i], col=colors[i], type="l", lty=2, lwd=2)
  points(mtimes, mlower[,i], col=colors[i], type="l", lty=2, lwd=2)
}
legend("topright",legend=labels,lty=1,col=colors[1:len_indices],lwd=4,cex=2)
graphics.off()

