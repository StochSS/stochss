function plotHistogram(inputFileNname)
clc;

%  plot a histogram by reading from an input file fname 	 
% example call:
% plotHistogram('../../models/examples/dimer_decay_output/histograms/hist_S2_3.dat')
% the histogram file naming convention is: hist_S<species index>_<time interval>,
% the above prints a histogram of the 2nd species (index starts at 1) at the 3rd time interval (index starts at 0)

%  open the input file
fid = fopen(inputFileNname);

%  read in the first line 
line1 = fgetl(fid);
sID = sscanf(line1,'%s %*s %*s %*s');    % species ID
line1str = sscanf(line1,'%*s %f %d %d');
time = line1str(1);   % time
sInd = line1str(2);   % species index
tInd = line1str(3);  % time index

%  read in the second line
line2 = str2num(fgetl(fid));
lb =line2(1);      % lower bound
ub =line2(2);      % upper bound
width =line2(3);   % width
bsize =line2(4);   % number of bins

%  read in the third line (bin counts)
data = str2num(fgetl(fid));
%  error checking
if (bsize~=length(data))
    error('retrieved size of bins are not equal to the number of bins in the data line')
end
fclose(fid);

%  plot the histogram
edgeVector = lb:width:ub;
centers = linspace((lb+lb+width)/2, (ub+ub-width)/2,bsize);
count=1;
x=zeros(sum(data),1);
for i=1:bsize
    for j=1:data(i)
        x(count)=edgeVector(i)+width/10;
        count= count+1;
    end
end
% Plot Histogram
hist(x,centers)
% Create xlabel
xlabel('Bin Centers');
% Create ylabel
ylabel('Bin Counts');
% Create title
titlestring= strcat('Species:  ',sID,'      Time:  ', num2str(time));
title(titlestring, 'FontWeight','demi');
