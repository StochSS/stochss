CREATE TABLE IF NOT EXISTS 'stochss' (
  'taskid' VARCHAR(64) PRIMARY KEY,
  'infrastructure' VARCHAR(16),
  'message' TEXT,
  'output' TEXT,
  'pid' VARCHAR(64),
  'uuid' VARCHAR(64),
  'start_time' TEXT,
  'status' TEXT,
  'time_taken' TEXT
);

CREATE TABLE IF NOT EXISTS 'stochss_cost_analysis' (
  'taskid' VARCHAR(128) PRIMARY KEY,
  'agent' VARCHAR(16),
  'instance_type' VARCHAR(32),
  'message' TEXT,
  'start_time' TEXT,
  'status' TEXT,
  'time_taken' TEXT,
  'uuid' VARCHAR(64)
);