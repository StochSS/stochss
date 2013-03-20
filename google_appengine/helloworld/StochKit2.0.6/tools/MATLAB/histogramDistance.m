function [euclidean_distance, manhattan_distance]=histogramDistance(fname1,fname2)

%  plot a histogram by reading form an input file fname 
%example call:
%histogramDistance('../../models/examples/dimer_decay_output/histograms/hist_S2_3.dat','../../models/examples/dimer_decay_output2/histograms/hist_S2_3.dat')
%note that the files have different paths

% clear figure variables used in this function
clear h;

%  plot a histogram by reading form an input file fname
%  open the input file
fid1 = fopen(fname1);
fid2 = fopen(fname2);

%  read in the first line 
line1 = fgetl(fid1);
sID = sscanf(line1,'%s %*s %*s %*s');    % species ID
line1str = sscanf(line1,'%*s %f %d %d');
time = line1str(1);   % time
sInd = line1str(2);   % species index
tInd = line1str(3);  % time index

line2 = fgetl(fid2);
sID2 = sscanf(line2,'%s %*s %*s %*s');    % species ID
line2str = sscanf(line2,'%*s %f %d %d');
time2 = line2str(1);   % actual time
sInd2 = line2str(2);   % species index
tInd2 = line2str(3);   % time index


if (~strcmp(sID,sID2))
    fprintf('Warning: Species ID mismatch');
    fprintf(['         ID1: %d   ID2: %d',sID,sID2]);
end
%  check for time 
if (time~=time2)
    fprintf('Warning: Time point mismatch');
    fprintf('         Time1: %f    Time2: %f',time,time2);
end

%  read in the second line
line2 = str2num(fgetl(fid1));
lb =line2(1);        % lower bound
ub =line2(2);        % upper bound
width =line2(3);     % width
bsize =line2(4);     % number of bins

line22 = str2num(fgetl(fid2));
lb2 =line22(1);      % lower bound
ub2 =line22(2);      % upper bound
width2 =line22(3);   % width
bsize2 =line22(4);   % number of bins

%  read in the third line (bin counts)
data = str2num(fgetl(fid1));
data2 = str2num(fgetl(fid2));
%  error checking
if (bsize~=length(data))
    error('file1: retrieved size of bins are not equal to the number of bins in the data line')
end
if (bsize2~=length(data2))
    error('file2: retrieved size of bins are not equal to the number of bins in the data line')
end
if (bsize~=bsize2)
    error('two histograms must have the same number of bins')
end

fclose(fid1);
fclose(fid2);

% Syncronize the histograms if necessary
if (sum(data)==0)
    % the first file has an empty histogram
    glb = lb2;
    gub = ub2;
elseif (sum(data2)==0)
    % the second file has an empty histogram
    glb = lb;
    gub = ub;
else
    % both histograms are non-empty
    llb = lb + (find(data>0,1)-1)*width;
    llb2 = lb2 + (find(data2>0,1)-1)*width2;
    glb = min(llb,llb2);
    lub = lb + (find(data>0,1,'last'))*width;  % do not subtract 1 to make open bound
    lub2 = lb2 + (find(data2>0,1,'last'))*width2; % do not subtract 1 to make open bound
    gub = max(lub,lub2);
end
gwidth = max(width, width2);

% check for an error
if(glb<0||glb>gub)
    error('error in bounds')
end
nlb = floor((glb/gwidth)*gwidth);
nub = nlb+length(data)*gwidth;
while (gub > nub) 
    gwidth = gwidth*2;
    nlb = floor(glb / gwidth) * gwidth;
    nub = nlb + length(data) * gwidth;
end
gIwidth = 1/gwidth;
his1 = zeros(1,length(data));
his2 = zeros(1,length(data2));

for i=0:length(data)-1
    if (data(i+1) ~= 0)
        event = lb+i*width;
        if (nlb>event || event>=nub)
            error('invalid new upper and/or lower bound');
        end
        his1(1+floor((event-nlb)*gIwidth)) = his1(1+floor((event-nlb)*gIwidth))+data(i+1);
    end
end
    
for i=0:length(data2)-1
    if (data2(i+1) ~= 0)
        event2 = lb2+i*width2;
        if (nlb>event2 ||event2>=nub)
            error('invalid new upper and/or lower bound');
        end
        his2(1+floor((event2-nlb)*gIwidth)) = his2(1+floor((event2-nlb)*gIwidth))+data2(i+1);
    end
end

% prepare for plotting
edgeVector = nlb:gwidth:nub;
binCenters = linspace((nlb+nlb+gwidth)/2, (nub+nub-width)/2,bsize);
x=zeros(sum(his1),1);
count=1;
for i=1:bsize
    for j=1:his1(i)
        x(count)=edgeVector(i)+gwidth/10;
        count= count+1;
    end
end
x2=zeros(sum(his2),1);
count=1;
for i=1:bsize
    for j=1:his2(i)
        x2(count)=edgeVector(i)+gwidth/10;
        count= count+1;
    end
end

[n, xout] = hist(x,binCenters);
hist(x,binCenters);
h = findobj(gca,'Type','patch');
set(h,'FaceColor','r','EdgeColor','w','facealpha',0.65)
hold on
[n2, xout2] = hist(x2,binCenters);
hist(x2,binCenters);
h = findobj(gca,'Type','patch');
set(h,'facealpha',0.65);
xlabel('Bin Centers');
% Create ylabel
ylabel('Bin Counts');
% Create title
titlestring= strcat('Species:  ',sID,'      Time:  ', num2str(time));
title(titlestring, 'FontWeight','demi');
legend('data 1','data 2');
hold off
% normalize
his1= his1/sum(his1);
his2= his2/sum(his2);

v = axis;
xpos = v(1)+(v(2)-v(1))*.1;
ypos = max(max(n),max(n2))+(v(4)-max(max(n),max(n2)))*.5;
euclidean_distance = sqrt(sum(abs(his1-his2).^2));
manhattan_distance = sum(abs(his1-his2));
tstr = {['Euclidian d=',num2str(euclidean_distance,'%2.3f'),'  Manhattan d=',num2str(manhattan_distance,'%2.3f')]};

text(xpos, ypos, tstr);

%uncomment below to saveas, though won't display perfectly
%set(gcf,'Renderer','ZBuffer');







