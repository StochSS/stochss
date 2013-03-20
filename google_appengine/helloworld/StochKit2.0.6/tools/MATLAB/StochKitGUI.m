function varargout = StochKitGUI(varargin)
% STOCHKITGUI M-file for StochKitGUI.fig
%      STOCHKITGUI, by itself, creates a new STOCHKITGUI or raises the existing
%      singleton*.
%
%      H = STOCHKITGUI returns the handle to a new STOCHKITGUI or the handle to
%      the existing singleton*.
%
%      STOCHKITGUI('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in STOCHKITGUI.M with the given input arguments.
%
%      STOCHKITGUI('Property','Value',...) creates a new STOCHKITGUI or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before StochKitGUI_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to StochKitGUI_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help StochKitGUI

% Last Modified by GUIDE v2.5 02-Dec-2010 13:54:20

% Begin initialization code - DO NOT EDIT

clc
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
    'gui_Singleton',  gui_Singleton, ...
    'gui_OpeningFcn', @StochKitGUI_OpeningFcn, ...
    'gui_OutputFcn',  @StochKitGUI_OutputFcn, ...
    'gui_LayoutFcn',  [] , ...
    'gui_Callback',   []);
if nargin && ischar(varargin{1})
    gui_State.gui_Callback = str2func(varargin{1});
end

if nargout
    [varargout{1:nargout}] = gui_mainfcn(gui_State, varargin{:});
else
    gui_mainfcn(gui_State, varargin{:});
end
global start_path_ps;
global start_path_pt;
global start_path_hd;
global start_path_h;
% End initialization code - DO NOT EDIT


% --- Executes just before StochKitGUI is made visible.
function StochKitGUI_OpeningFcn(hObject, eventdata, handles, varargin)
% This function has no output args, see OutputFcn.
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
% varargin   command line arguments to StochKitGUI (see VARARGIN)

% Choose default command line output for StochKitGUI
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes StochKitGUI wait for user response (see UIRESUME)
% uiwait(handles.figure1);

% the most current figure


% --- Outputs from this function are returned to the command line.
function varargout = StochKitGUI_OutputFcn(hObject, eventdata, handles)
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;


% --- Executes on button press in plotStats.

% --- Executes on button press in plotStats.
function plotStats_Callback(hObject, eventdata, handles)
% hObject    handle to plotStats (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
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
global start_path_ps
folder_name = uigetdir(start_path_ps,'Select directory where means.txt and variances.txt are stored');
if(folder_name==0) % user pressed cancel
    return
end
start_path_ps = folder_name;


fnameM = fullfile(folder_name,'means.txt');
fnameV = fullfile(folder_name,'variances.txt');

if (exist(fnameM,'file')==0)   
    errordlg('"means.txt" file does not exist.','Input Directory Error')
    return
end
if (exist(fnameV,'file')==0)   
    errordlg('"variances.txt" file does not exist.','Input Directory Error')
    return
end 

prompt = {'Enter reaction indices (comma separated):'};
dlg_title = 'Reaction indices to plot';
num_lines = 1;
def = {'ALL: leave this as is to plot all reactions'};
answer = inputdlg(prompt,dlg_title,num_lines,def);
if isempty(answer)
    return
end
global indices
if strcmp(def,answer{1})
    indices = -1;
else
    inds = textscan(answer{1},'%d ','delimiter',',');
    indices = inds{1}';
    if (min(indices)<=0)
        errordlg('Indices must be positive integers.','Neg Ind Error')
        return
    end
    [indices2, m, n] =unique(indices);
    if (length(indices2)~=length(indices))
        countDuplicate = length(n) - length(m);
        str = ['Removed ',num2str(countDuplicate),' duplicate indices...'];
        warndlg(str,'Warning')
        indices=indices2;
    end
    indices = indices+1; % add 1 to account for the time column
    indices = sort(indices);
    len_indices =length(indices);
end

fid1 = fopen(fnameM);
if fid1==-1
  error('means.txt file not found or permission denied');
end
fid2 = fopen(fnameV);
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

[fm fn] = size(mdata);
if (indices==-1)
    indices=2:fn;
end
mtimes = mdata(:,1);
vtimes = vdata(:,1);
if ~isequal(mtimes, vtimes)
    error('ERROR: mean and variance should have the same time points');
else
    time = mtimes;
end
if ~strcmp(mheader, vheader)
    error('ERROR: mean and variance should have identical labels');
end

means = mdata(:,indices);
vars = vdata(:,indices);

if strcmp(mheader,'')
    labels= cell(1,length(indices));
    for i=1:length(indices)
        labels(i)=cellstr(['Index ',num2str(indices(i)-1)]);
    end
else
    labels = textscan(mheader,'%s');
    labels = labels{1}(indices);
end


figure('name','f1');
if length(indices)<length(colors)
    for i=1:length(indices)
        plot(time, means(:,i),'Color',colors(i,:),'LineWidth',2);
        hold on
        plot(time,means(:,i)+sqrt(vars(:,i)),'--','Color',colors(i,:),'HandleVisibility','off')
        plot(time,means(:,i)-sqrt(vars(:,i)),'--','Color',colors(i,:),'HandleVisibility','off')
    end
else
    for i=1:length(colors)
        plot(time,means(:,i),'Color',colors(i,:),'LineWidth',2)
        hold on
        plot(time,means(:,i)+sqrt(vars(:,i)),'--','Color',colors(i,:),'HandleVisibility','off')
        plot(time,means(:,i)-sqrt(vars(:,i)),'--','Color',colors(i,:),'HandleVisibility','off')
    end
    for i=length(colors)+1:length(indices)
        randomColor = [rand rand rand];
        plot(time,means(:,i),'Color',randomColor,'LineWidth',2)
        hold on
        plot(time,means(:,i)+sqrt(vars(:,i)),'--','Color',randomColor,'HandleVisibility','off')
        plot(time,means(:,i)-sqrt(vars(:,i)),'--','Color',randomColor,'HandleVisibility','off')
    end
end
if (length(time)==1)
    xlim([time(1)*.9 time(1)*1.1])
else
    xlim([time(1),time(length(time))])
end
legend(labels)
xlabel('time','FontSize',12,'FontWeight','demi')
ylabel('population','FontSize',12,'FontWeight','demi')
title('stats plot','FontSize',12,'FontWeight','demi')
global mrf
mrf = gcf;

% --- Executes on button press in plotTraj.
function plotTraj_Callback(hObject, eventdata, handles)
% hObject    handle to plotTraj (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
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

global start_path_pt
[FileName,PathName] = uigetfile({'*.txt',  'Text files (*.txt)'; '*.dat','Data Files (*.data)';...
    '*.*',  'All Files (*.*)'}, 'Select StochKit output file(s) for plotting trajectories','MultiSelect','on',start_path_pt);
if(isnumeric(FileName)) % user pressed cancel
    return
end
2
start_path_pt = PathName

fnType= iscell(FileName);
if fnType
    fileLen = length(FileName); % multiple files
else
    fileLen = 1; % single file
end

prompt = {'Enter species indices (comma separated):'};
dlg_title = 'Species indices to plot';
num_lines = 1;
def = {'ALL: leave this as is to plot all species'};
answer = inputdlg(prompt,dlg_title,num_lines,def);
if isempty(answer)
    return
end
global indices
if strcmp(def,answer{1})
    indices = -1;
else
    inds = textscan(answer{1},'%d ','delimiter',',');
    indices = inds{1}';
    if (min(indices)<=0)
        errordlg('Indices must be positive integers.','Neg Ind Error')
    end
    [indices2, m, n] =unique(indices);
    if (length(indices2)~=length(indices))
        countDuplicate = length(n) - length(m);
        str = ['Removed ',num2str(countDuplicate),' duplicate indices...'];
        warndlg(str,'Warning')
        indices=indices2;
    end
    indices = indices+1; % add 1 to account for the time column
    indices = sort(indices);
end

% load the first file
if fnType
    fname = fullfile(PathName,FileName{1});
else
    fname = fullfile(PathName,FileName);
end

fid = fopen(fname);
if fid==-1
    error('ERROR: First trajectory file not found or permission denied');
end

no_lines = 0;
max_line = 0;
ncols = 0;
data = [];

line = fgetl(fid);
if ~ischar(line)
    error('ERROR: First trajectory file contains no data')
end
[data, ncols, errmsg, nxtindex] = sscanf(line, '%f');

while isempty(data)||(nxtindex==1)
    no_lines = no_lines+1;
    max_line = max([max_line, length(line)]);
    eval(['line', num2str(no_lines), '=line;']);
    line = fgetl(fid);
  if ~ischar(line)
      error('ERROR: file contains no data')
  end
  [data, ncols, errmsg, nxtindex] = sscanf(line, '%f');
end 

data = [data; fscanf(fid, '%f')];
fclose(fid);

theader = setstr(' '*ones(no_lines, max_line));
for i = 1:no_lines
    varname = ['line' num2str(i)];
    if eval(['length(' varname ')~=0'])
        eval(['theader(i, 1:length(' varname ')) = ' varname ';'])
    end
end 
eval('data = reshape(data, ncols, length(data)/ncols)'';', '');
if (max(indices)> ncols) 
    error('Index exceeds data dimensions')
end
[fm fn] = size(data);
if (indices==-1)
    indices=2:fn;
end
time = data(:,1);
data = data(:,indices);
data_strct = zeros(length(time),length(indices),fileLen);
data_strct(:,:,1) = data;

for i=2:(fileLen+1)
    if fnType
        fname = fullfile(PathName,FileName{i-1});
    else
        fname = fullfile(PathName,FileName);
    end
    fid = fopen(fname);
    if fid==-1
        error(['ERROR: trajectory file #',num2str(i-1),' not found or permission denied']);
    end
    data = [];
    if strcmp(theader,'')
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
    data_strct(:,:,i) = data(:,indices);
    fclose(fid);
end   

if strcmp(theader,'')
    % create label with species ID
    labels= cell(1,length(indices));
    for i=1:length(indices)
        labels(i)=cellstr(['Column ',num2str(indices(i)-1)]);
    end
else
    labels = textscan(theader,'%s');
    labels = labels{1}(indices);
end  
% if number of indices require more colors for plotting, generate random
% colors
[a b c] = size(data_strct);
figure('name','f2');
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
        plot(time,squeeze(data_strct(:,i,2:c)),'Color',colors(i,:),'HandleVisibility','off')
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
xlabel('time','FontSize',12,'FontWeight','demi')
ylabel('population','FontSize',12,'FontWeight','demi')
title('trajectory plot','FontSize',12,'FontWeight','demi')
global mrf
mrf = gcf;

% --- Executes during object creation, after setting all properties.
function plotTraj_CreateFcn(hObject, eventdata, handles)
% hObject    handle to plotTraj (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called


% --- Executes on button press in pHist.
function pHist_Callback(hObject, eventdata, handles)
% hObject    handle to pHist (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
global start_path_h;
[FileName,PathName] = uigetfile({'*.dat','Data Files (*.data)';
    '*.txt',  'Text files (*.txt)'; ...
    '*.*',  'All Files (*.*)'}, 'Select a StochKit histogram file',start_path_h);
if(FileName==0) % user pressed cancel
    return
end
start_path_h=PathName;
histFile = fullfile(PathName,FileName);
fid = fopen(histFile);
%  read in the first line
try
    line1 = fgetl(fid);
    line1str = textscan(line1,'%s %f %d %d');
    sID = line1str{1};    % species ID
    time = line1str{2};   % time
    sInd = line1str{3};   % species index
    tInd = line1str{4};   % time index
    %  read in the second line
    line2 = str2num(fgetl(fid));
    lb =line2(1);      % lower bound
    ub =line2(2);      % upper bound
    width =line2(3);   % width
    bsize =line2(4);   % number of bins
    %  read in the third line (bin counts)
    data = str2num(fgetl(fid));
catch exception
    errordlg('Error while loading the histogram file', 'Loading Error');
    return
end
%  error checking
if (bsize~=length(data))
    errordlg('Retrieved size of bins is not equal to the number of bins variable in the file','Consistency Error')
    return
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
figure('name','f3');
hist(x,centers)
% Create xlabel
xlabel('Bin Centers');
% Create ylabel
ylabel('Bin Counts');
% Create title
titlestring= strcat('Species:  ',sID,'      Time:  ', num2str(time));
title(titlestring, 'FontWeight','demi');
global mrf
mrf = gcf;


% --- Executes on button press in hDist.
function hDist_Callback(hObject, eventdata, handles)
% hObject    handle to hDist (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
global start_path_hd;
[FileName1,PathName1] = uigetfile({'*.dat','Data Files (*.data)';
    '*.txt',  'Text files (*.txt)'; ...
    '*.*',  'All Files (*.*)'}, 'Select the first StochKit histogram output file', start_path_hd);
if(FileName1==0) % user pressed cancel
    return
end
start_path_hd = PathName1;
histFile1 = fullfile(PathName1,FileName1);
fid1 = fopen(histFile1);
[FileName2,PathName2] = uigetfile({'*.dat','Data Files (*.data)';
    '*.txt',  'Text files (*.txt)'; ...
    '*.*',  'All Files (*.*)'}, 'Select the second StochKit histogram output file',start_path_hd);
if(FileName2==0) % user pressed cancel
    return
end
histFile2 = fullfile(PathName2,FileName2);
fid2 = fopen(histFile2);
%  read in the first line
try
    line1 = fgetl(fid1);
    line1str = textscan(line1,'%s %f %d %d');
    sID = char(line1str{1});     % species ID
    time = line1str{2};   % actual time
    sInd = line1str{3};   % species index
    tInd = line1str{4};   % time index
    line2 = fgetl(fid2);
    line2str = textscan(line2,'%s %f %d %d');
    sID2 = char(line2str{1});    % species ID
    time2 = line2str{2};   % actual time
    sInd2 = line2str(3);   % species index
    tInd2 = line2str(4);   % time index
    
    if (~strcmp(sID,sID2))
        warndlg(sprintf(['Warning: Species ID mismatch\n','         ID1: ',sID,'   ID2: ',sID2]))
    end
    %  check for time
    if (time~=time2)
        warndlg(sprintf(['Warning: Time point mismatch\n','         Time1: ',num2str(time),'   Time2: ',num2str(time2)]))
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
    
catch exception
    errordlg('Error while loading histogram files', 'Loading Error');
    return
end


%  error checking
if (bsize~=length(data))
    errordlg('File 1: Retrieved size of bins is not equal to the number of bins variable in the file','Consistency Error')
    return
end
if (bsize2~=length(data2))
    errordlg('File 2: Retrieved size of bins is not equal to the number of bins variable in the file','Consistency Error')
    return
end
if (bsize~=bsize2)
    errordlg('Two histograms must have the equal number of bins','Consistency Error')
    return
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
    errordlg('Upper and lower bounds are incorrect','Consistency Error')
    return
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
            errordlg('File 1: invalid new upper and/or lower bound','Consistency Error')
            return
        end
        his1(1+floor((event-nlb)*gIwidth)) = his1(1+floor((event-nlb)*gIwidth))+data(i+1);
    end
end
for i=0:length(data2)-1
    if (data2(i+1) ~= 0)
        event2 = lb2+i*width2;
        if (nlb>event2 ||event2>=nub)
            errordlg('File 2: invalid new upper and/or lower bound','Consistency Error')
            return
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
figure('name','f4');
hist(x,binCenters);
h = findobj(gca,'Type','patch');
set(h,'FaceColor','r','EdgeColor','w','facealpha',0.65)
hold on
hist(x2,binCenters);
h = findobj(gca,'Type','patch');
set(h,'facealpha',0.65)
xlabel('Bin Centers');
% Create ylabel
ylabel('Bin Counts');
% Create title
titlestring= strcat('Species:  ',sID,'      Time:  ', num2str(time));
title(titlestring, 'FontWeight','demi');
legend('data 1','data 2')
% normalize
his1= his1/sum(his1);
his2= his2/sum(his2);
euclidean_distance = sqrt(sum(abs(his1-his2).^2));
manhattan_distance = sum(abs(his1-his2));
annotation('textbox',[0.1429 0.7905 0.2893 0.1238],...
    'String',{['Euclidian d=',num2str(euclidean_distance)],['Manhattan d=',num2str(manhattan_distance)]},...
    'LineStyle','none');
global mrf
mrf = gcf;

% --- Executes on button press in saveFig.
function saveFig_Callback(hObject, eventdata, handles)
% hObject    handle to saveFig (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
shg
[file,path] = uiputfile( {'*.m;*.fig;*.mat;*.mdl','MATLAB Files (*.m,*.fig,*.mat,*.mdl)'; ...
    '*.jpg', 'JPG files (*.jpg)'; '*.fig','Figures (*.fig)';...
    '*.*',  'All Files (*.*)'}, 'Save the Current Figure As');
outFile = fullfile(path,file);
global mrf
set(0,'CurrentFigure',mrf) 
saveas(gcf,outFile)

% --- Executes on button press in closeFig.
function closeFig_Callback(hObject, eventdata, handles)
% hObject    handle to closeFig (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
close(findobj('type','figure','name','f1'))
close(findobj('type','figure','name','f2'))
close(findobj('type','figure','name','f3'))
close(findobj('type','figure','name','f4'))
