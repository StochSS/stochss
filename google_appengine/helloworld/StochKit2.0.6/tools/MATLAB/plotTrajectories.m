function plotTrajectories(inputFileDirectory,startn,endn,indices)
clc;

% indices which corresponds to species indices. For example, if the user
% wants to plot trajectories of 4th,7th, and 10th species, indices=[4 7
% 10]. label is an integer input parameter that indicates whether the
% trajectory file contains labels or not. If it contains label, label=1 and
% the plotTrajectories function uses those labels in the legend. If label
% is not present, i.e. label=0, species indices are used as the legend.

% Example to run the function 
% plotTrajectories('../../models/examples/dimer_decay_output/trajectories',0,9,[1,2,3])
% where 0,9 means trajectories 0 through 9 (note index starts at 0)
% and where [1,2,3] means species indexes 1,2,3 (note index starts at 1)

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

% Check to make sure start and end file numbers are integers
if ((round(startn)~=startn) || (round(endn) ~= endn))
    error ('need integer numbers for input file indexing')
end
if (startn > endn)
    error ('start file index is larger than the end file index')
end
if (length(indices)==0)
    error('indices vector must not be empty')
end

% Check to make sure that the indices are integers
if (sum((round(indices)==indices)) ~= length(indices))
    error('indices must be integers')
end

% Check to make sure that the indices are greater than 0
if (min(indices)<=0)
    error('indices must be positive integers')
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
len_indices = length(indices);
% Read in the first data from trajectory files
fname = fullfile(inputFileDirectory,['trajectory',num2str(startn),'.txt']);
fid = fopen(fname);
if fid==-1
    error('First trajectory file not found or permission denied');
end
no_lines = 0;
max_line = 0;
ncols = 0;
data = [];

line = fgetl(fid);
if ~ischar(line)
    error('ERROR: first trajectory file contains no data')
end
[data, ncols, errmsg, nxtindex] = sscanf(line, '%f');

while isempty(data)||(nxtindex==1)
    no_lines = no_lines+1;
    max_line = max([max_line, length(line)]);
    eval(['line', num2str(no_lines), '=line;']);
    line = fgetl(fid);
    if ~ischar(line)
        error('ERROR: first trajectory file contains no data')
    end
    [data, ncols, errmsg, nxtindex] = sscanf(line, '%f');
end
data = [data; fscanf(fid, '%f')];
fclose(fid);

% don't need to add 1. ncols has an extra time column and indices were
% incremented by 1. 
if (max(indices)> ncols) 
    error('Index exceeds data dimensions')
end


header = setstr(' '*ones(no_lines, max_line));
for i = 1:no_lines
    varname = ['line' num2str(i)];
    if eval(['length(' varname ')~=0'])
        eval(['header(i, 1:length(' varname ')) = ' varname ';'])
    end
end
eval('data = reshape(data, ncols, length(data)/ncols)'';', '');
time = data(:,1);
data = data(:,indices);
data_strct = zeros(length(time),length(indices),endn-startn+1);
data_strct(:,:,1) = data;

count=2;
for i=(startn+1):endn
    fname = fullfile(inputFileDirectory,['trajectory',num2str(i),'.txt']);
    fid = fopen(fname);
    if fid==-1
        error(['ERROR: trajectory file #',num2str(i),' not found or permission denied']);
    end
    data = [];
    if strcmp(header,'')
        try
            data = [data; fscanf(fid, '%f')];
        catch exception
            throw(exception);
        end
    else
        line = fgetl(fid);
        try
            data = [data; fscanf(fid, '%f')];
        catch exception
            throw(exception);
        end       
    end
    eval('data = reshape(data, ncols, length(data)/ncols)'';', '');
    data_strct(:,:,count) = data(:,indices);
    count = count+1;
    fclose(fid);
end
inds= regexpi(header,'\s');
if strcmp(header,'')
    labels= cell(1,length(indices));
    for i=1:length(indices)
        labels(i)=cellstr(['Index ',num2str(indices(i)-1)]);
    end
else
    labels = cell(1,len_indices);
    for i=1:(len_indices-1)
        labels{i} = header(inds(indices(i)-1)+1:inds(indices(i))-1);
    end
    if indices(end)==ncols
        labels{len_indices} = header(inds(ncols-1)+1:end);
    else
        labels{len_indices} = header(inds(indices(end)-1)+1:inds(indices(end))-1);
    end
end
[a b c] = size(data_strct);
% If number of indices require more colors for plotting, generate random colors
if length(indices)<length(colors)
    for i=1:length(indices)
        plot(time,squeeze(data_strct(:,i,1)),'Color',colors(i,:))
        hold on
        if c>1
            plot(time,squeeze(data_strct(:,i,2:c)),'Color',colors(i,:),'HandleVisibility','off')
        end
    end
    legend(labels)
else
    for i=1:length(colors)
        plot(time,squeeze(data_strct(:,i,1)),'Color',colors(i,:))
        hold on
        if c>1
            plot(time,squeeze(data_strct(:,i,2:c)),'Color',colors(i,:),'HandleVisibility','off')
        end
    end
    for i=length(colors)+1:length(indices)
        colorVector = [rand rand rand];
        plot(time,squeeze(data_strct(:,i,1)),'Color',colorVector)
        hold on
        if c>1
            plot(time,squeeze(data_strct(:,i,2:c)),'Color',colorVector,'HandleVisibility','off')
        end
    end
    legend(labels)
end
hold off
xlabel('time','FontSize',14,'FontWeight','demi')
ylabel('population','FontSize',14,'FontWeight','demi')
title('trajectory plot','FontSize',14,'FontWeight','demi')
