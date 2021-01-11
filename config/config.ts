const config = {
    "servers": [
        {"name": "localhost", "url": "localhost:8001"},
        {"name": "edevel", "url": "192.168.16.51:8001"},
        {"name": "stage", "url": "stage.ebrana.cz:8001"},
        {"name": "ep1", "url": "ep1.ebrana.cz:8001"},
        {"name": "imes2", "url": "hosting-imes2.ebrana.cz:8001"},
    ],
    "jwt": {
        "enable": true
    },
    "events": [
        {event: 'historyCount'},
        {event: 'historyCountIncreased'},
        {event: 'historyCountDecreased'},
        {event: 'threadsCount'},
        {event: 'threadsSettings'},
        {event: 'plannedCount'},
        {event: 'waitingCount'},
        {event: 'waitingCountIncreased'},
        {event: 'waitingCountDecreased'},
        {event: 'jobFetched'},
        {event: 'jobCompleted'},
        {event: 'jobStarted'},
        {event: 'newThreadsStat'},
        {event: 'immediateQueueData'},
        {event: 'plannedQueueData'},
        {event: 'runningJobsList'},
        {event: 'historyQueueData'},
        {event: 'immediateQueueData'},
        {event: 'plannedQueueData'},
        {event: 'threadsStats'},
        {event: 'settingSaved'},
        {event: 'settingSavedFalse'},
        {event: 'loginSuccess'},
        {event: 'loginError'},
        {event: 'refreshTokenSuccess'},
        {event: 'refreshTokenError'},
    ]
};

export default config