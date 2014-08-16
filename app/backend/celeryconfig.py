# localhost should get changed to be the hostname of the 
# head node unless its on the same physical machine
BROKER_URL = "amqp://stochss:ucsb@ec2-54-89-116-75.compute-1.amazonaws.com:5672/"
CELERY_RESULT_BACKEND = "amqp://"
CELERY_TASK_SERIALIZER = "pickle"
CELERY_RESULT_SERIALIZER = "pickle"
# Since we dont need rate limiting, disabling it will
# give performance improvements.
# http://celery.readthedocs.org/en/latest/userguide/tasks.html#disable-rate-limits-if-they-re-not-used
CELERY_DISABLE_RATE_LIMITS = True
# Set Prefetch Multiplier to 1, i.e. make sure each worker
# only tries to pick up one task at a time for each processor
# that is available. (CELERYD_CONCURRENCY deaults to number of
# cores available on machine)
CELERYD_PREFETCH_MULTIPLIER = 1
# Uncomment this to make sure that if a worker dies while executing
# a task, the task gets sent back to the queue. (NOTE: this could
# be bad if there is a task that always fails, e.g. always raises
# an exception)
# CELERY_ACKS_LATE = True
