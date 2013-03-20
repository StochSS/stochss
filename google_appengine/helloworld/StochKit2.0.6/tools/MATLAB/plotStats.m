function plotStats(inputFileDirectory,indices)
clc;
%  plot means and standard deviations
% variances fiels are stored
% indices is a vector of species indices to plot
% label is a integer where label=0 means the means and variances files do
% not contain labels. label=1 means the first line of the file contains
% labels for species. label=1 will cause the labels to be displayed in the
% legend of the plot. label=0 will use species indices as legend.

% Example to run the function from $STOCHKIT_HOME/tools/MATLAB after running dimer decay example
% plotStats('../../models/examples/dimer_decay_output/stats',[1,2,3])
% where [1,2,3] specifies printing species indexes 1,2 and 3

% Color vector
colors = [  0 0 1; % blue
    1 0 0;  % red
    0 1 0; % green
    1 0 1; % magenta
    0 1 1;  % cyan
    0 0 0; % black
    1 1 0;  % yellow
    0.6377    0.9577    0.2407; % light green
    0.8754    0.5181    0.9436; % purple
    0.6951    0.0680    0.2548; % dark pink
    ];

% Get time data from the first input file and use it as a reference
fnameMean = fullfile(inputFileDirectory,'means.txt');
fnameVar =  fullfile(inputFileDirectory,'variances.txt');


% Check to make sure that the indices are integers
if (sum((round(indices)==indices)) ~= length(indices))
    error('need integer indices')
end

% Check to make sure that the indices are greater than 0
if (min(indices)<=0)
    error('indices need to be positive integers')
end

% Check to eliminate duplicate indices
[indices2, m, n] =unique(indices);
if (length(indices2)~=length(indices))
    countDuplicate = length(n) - length(m);
    display(['removing ',num2str(countDuplicate),' duplicate indices...'])
    indices=indices2;
end

indices = indices+1; % add 1 to account for the time column
indices = sort(indices);
len_indices =length(indices);


fid1 = fopen(fnameMean);
if fid1==-1
  error('means.txt file not found or permission denied');
end
fid2 = fopen(fnameVar);
if fid2==-1
  error('variances.txt file not found or permission denied');
end


% Read in the means.txt data
no_lines = 0;
max_line = 0;
ncols = 0;
mdata = [];

line = fgetl(fid1);
if ~ischar(line)
    error('ERROR: means.txt file contains no data')
end
[mdata, ncols, errmsg, nxtindex] = sscanf(line, '%f');

while isempty(mdata)||(nxtindex==1)
    no_lines = no_lines+1;
    max_line = max([max_line, length(line)]);
    eval(['line', num2str(no_lines), '=line;']);
    line = fgetl(fid1);
  if ~ischar(line)
      error('ERROR: file contains no data')
  end
  [mdata, ncols, errmsg, nxtindex] = sscanf(line, '%f');
end 

mdata = [mdata; fscanf(fid1, '%f')];
fclose(fid1);


mheader = setstr(' '*ones(no_lines, max_line));
for i = 1:no_lines
    varname = ['line' num2str(i)];
    if eval(['length(' varname ')~=0'])
        eval(['mheader(i, 1:length(' varname ')) = ' varname ';'])
    end
end 

eval('mdata = reshape(mdata, ncols, length(mdata)/ncols)'';', '');



% Read in the variances.txt data
no_lines = 0;
max_line = 0;
ncols = 0;
vdata = [];

line = fgetl(fid2);
if ~ischar(line)
    error('ERROR: means.txt file contains no data')
end
[vdata, ncols, errmsg, nxtindex] = sscanf(line, '%f');

while isempty(vdata)||(nxtindex==1)
    no_lines = no_lines+1;
    max_line = max([max_line, length(line)]);
    eval(['line', num2str(no_lines), '=line;']);
    line = fgetl(fid2);
  if ~ischar(line)
      error('ERROR: file contains no data')
  end
  [vdata, ncols, errmsg, nxtindex] = sscanf(line, '%f');
end 
vdata = [vdata; fscanf(fid2, '%f')];
fclose(fid2);

vheader = setstr(' '*ones(no_lines, max_line));
for i = 1:no_lines
    varname = ['line' num2str(i)];
    if eval(['length(' varname ')~=0'])
        eval(['vheader(i, 1:length(' varname ')) = ' varname ';'])
    end
end 

eval('vdata = reshape(vdata, ncols, length(vdata)/ncols)'';', '');


mtimes = mdata(:,1);
vtimes = vdata(:,1);
if ~isequal(mtimes, vtimes)
    error('ERROR: mean and variance should have the same time points');
end

if ~strcmp(mheader, vheader)
    error('ERROR: mean and variance should have identical labels');
end

means = mdata(:,indices);
vars = vdata(:,indices);
inds= regexpi(mheader,'\s');

if strcmp(mheader,'')
    labels= cell(1,length(indices));
    for i=1:length(indices)
        labels(i)=cellstr(['Index ',num2str(indices(i)-1)]);
    end
else
    labels = cell(1,len_indices);
    for i=1:(len_indices-1)
        labels{i} = mheader(inds(indices(i)-1)+1:inds(indices(i))-1);
    end
    if indices(end)==ncols
        labels{len_indices} = mheader(inds(ncols-1)+1:end);
    else
        labels{len_indices} = mheader(inds(indices(end)-1)+1:inds(indices(end))-1);
    end
end


if length(indices)<length(colors)
    for i=1:length(indices)
        plot(mtimes, means(:,i),'Color',colors(i,:),'LineWidth',2);
        hold on
        plot(mtimes,means(:,i)+sqrt(vars(:,i)),'--','Color',colors(i,:),'HandleVisibility','off')
        plot(mtimes,means(:,i)-sqrt(vars(:,i)),'--','Color',colors(i,:),'HandleVisibility','off')
    end
else
    for i=1:length(colors)
        plot(mtimes,means(:,i),'Color',colors(i,:),'LineWidth',2)
        hold on
        plot(mtimes,means(:,i)+sqrt(vars(:,i)),'--','Color',colors(i,:),'HandleVisibility','off')
        plot(mtimes,means(:,i)-sqrt(vars(:,i)),'--','Color',colors(i,:),'HandleVisibility','off')
    end
    for i=length(colors)+1:length(indices)
        randomColor = [rand rand rand];
        plot(mtimes,means(:,i),'Color',randomColor,'LineWidth',2)
        hold on
        plot(mtimes,means(:,i)+sqrt(vars(:,i)),'--','Color',randomColor,'HandleVisibility','off')
        plot(mtimes,means(:,i)-sqrt(vars(:,i)),'--','Color',randomColor,'HandleVisibility','off')
    end
end
hold off
if (length(mtimes)==1)
    xlim([mtimes(1)*.9 mtimes(1)*1.1])
else
    xlim([mtimes(1),mtimes(end)])  
end
legend(labels)
xlabel('time','FontSize',14,'FontWeight','demi')
ylabel('population','FontSize',14,'FontWeight','demi')
title('stats plot','FontSize',14,'FontWeight','demi')
