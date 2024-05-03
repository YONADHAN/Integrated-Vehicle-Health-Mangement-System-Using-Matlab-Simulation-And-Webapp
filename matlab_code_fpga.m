% Read the CSV file
error_data = readtable('IncorrectData.xlsx');
correct_data = readtable('correctData.xlsx');
 
% Define the sequence of signals and time points
signals = {'signal1', 'signal2', 'signal3', 'signal4', 'signal5', 'signal6', 'signal7', 'signal8', 'signal9', 'signal10', 'signal11', 'signal12', 'signal13', 'signal14', 'signal15', 'signal16', 'signal17', 'signal18', 'signal19', 'signal20', 'signal21', 'signal22', 'signal23', 'signal24', 'signal25'};

time_points = 1:200; % Assuming data for all time points is available

% Create a UDP socket
u = udp('127.0.0.1', 54321); % Replace '127.0.0.1' with the IP address of your Node.js server and 12345 with the desired port number
fopen(u);

% Loop through each time point with a delay of 100 milliseconds
for t = 1:length(time_points)
    % Extract the signal name and corresponding data at the current time point
    signal_name = signals{mod(t-1, length(signals))+1}; % Modulo operation ensures cycling through signals
    data_value = error_data{t, strcmp(signal_name, error_data.Properties.VariableNames)}; 
    
    % Call the function to check the data
    array_to_send = check_data(t, data_value, correct_data);
    
    % Convert the array to a string
    array_str = sprintf('%d ', array_to_send);
    
    % Send the data over UDP
    fwrite(u, array_str);
    
    % Pause for 100 milliseconds
    pause(0.5); % 500 milliseconds
end

% Close the UDP socket
fclose(u);
delete(u);

function array_to_send = check_data(t, data_value, correct_data)
    signal_number = mod(t-1, 25) + 1;
    setThreshold = 0;
   switch signal_number
    case 1
        setThreshold = 5;
    case 2
        setThreshold = 10;
    case 3
        setThreshold = 6;
    case 4
        setThreshold = 7;
    case 5
        setThreshold = 8;
    case 6
        setThreshold = 6;
    case 7
        setThreshold = 6;
    case 8
        setThreshold = 6;
    case 9
        setThreshold = 6;
    case 10
        setThreshold = 6;
    case 11
        setThreshold = 6;
    case 12
        setThreshold = 6;
    case 13
        setThreshold = 6;
    case 14
        setThreshold = 6;
    case 15
        setThreshold = 6;
    case 16
        setThreshold = 6;
    case 17
        setThreshold = 6;
    case 18
        setThreshold = 6;
    case 19
        setThreshold = 6;
    case 20
        setThreshold = 6;
    case 21
        setThreshold = 6;
    case 22
        setThreshold = 6;
    case 23
        setThreshold = 6;
    case 24
        setThreshold = 6;
    case 25
        setThreshold = 6;
end


    row_index = t;
    data = correct_data{row_index, signal_number};
    upper_limit = data + setThreshold; 
    lower_limit = data - setThreshold;  
    if data_value < lower_limit || data_value > upper_limit
        array_to_send = [t, signal_number, data_value, lower_limit, data , upper_limit];
        disp(array_to_send);
    end
end
