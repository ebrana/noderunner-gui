import {createStore} from "vuex";
// @ts-ignore
import config from "../../config/config";
import moment from "moment";

interface iStats {
    'date': Date,
    'intervalTo': number,
    'byThread': Array<iStats>
}

export default createStore({
    devtools: true,
    state: {
        server: '',
        historyCounter: 0,
        historyCounterInit: false,
        waitingCounterInit: false,
        waitingCounter: 0,
        plannedCounter: 0,
        threadsCounter: 0,
        threads: [],
        threadsStats: [],
        runningJobsList: [],
        newThreadsStat: [],
        invalidateChart: false,
        colors: [],
        showPreloader: true,
        listItems: []
    },
    mutations: {
        showPreloader(state, value) {
            state.showPreloader = value
        },
        server(state, hostname) {
            state.server = hostname
        },
        invalidateChart(state, value) {
            state.invalidateChart = value
        },
        colors(state, value) {
            state.colors = value
        },
        resetListItems(state) {
            state.listItems = [];
        },
        emitData(state, data) {
            let findIndex = false
            let dataProvider

            // console.log(config.events[data.key].event, data.value)
            switch (config.events[data.key].event) {
                case 'historyCountDecreased':
                    if (state.historyCounterInit === true) {
                        state.historyCounter -= data.value
                        if (state.historyCounter < 0) {
                            state.historyCounter = 0
                        }
                    }
                    break;
                case 'historyCountIncreased':
                    if (state.historyCounterInit === true) {
                        state.historyCounter += data.value
                    }
                    break;
                case 'historyCount':
                    state.historyCounter = data.value
                    state.historyCounterInit = true
                    break;
                case 'threadsCount':
                    // state.threadsCounter = data.value;
                    // state.showPreloader = false;
                    break;
                case 'threadsSettings':
                case 'settingSaved':
                    state.threadsCounter = data.value.length
                    state.threads = data.value
                    state.showPreloader = false;
                    break;
                case 'plannedCount':
                    state.plannedCounter = data.value
                    break;
                case 'waitingCount':
                    state.waitingCounter = data.value
                    state.waitingCounterInit = true
                    break;
                case 'waitingCountIncreased':
                    if (state.waitingCounterInit === true) {
                        state.waitingCounter += data.value
                    }
                    break;
                case 'waitingCountDecreased':
                    if (state.waitingCounterInit === true) {
                        state.waitingCounter -= data.value
                        if (state.waitingCounter < 0) {
                            state.waitingCounter = 0
                        }
                    }
                    break;
                case 'runningJobsList':
                    state.runningJobsList = data.value
                    if (Object.keys(state.runningJobsList).length === 0) { // min lenght 1
                        // @ts-ignore
                        state.runningJobsList.push({'thread': 0, 'command': ''})
                    }
                    break;
                case 'jobFetched':
                case 'jobStarted':
                    for (let index in state.runningJobsList) {
                        // @ts-ignore
                        if (state.runningJobsList[index].thread == data.value.thread) {
                            // @ts-ignore
                            state.runningJobsList[index] = data.value
                            findIndex = true
                            break;
                        }
                    }
                    if (findIndex === false) {
                        // @ts-ignore
                        state.runningJobsList.push(data.value)
                    }
                    break;
                case 'jobCompleted':
                    for (const item in state.runningJobsList) {
                        // @ts-ignore
                        if (state.runningJobsList[item]._id == data.value._id) {
                            // console.log('odebran index ', item, state.runningJobsList[item].runningTime)
                            // @ts-ignore
                            state.runningJobsList[item] = {'thread': parseInt(item), 'command': ''}
                            break;
                        }
                    }
                    break;
                case 'threadsStats':
                    state.threadsStats = data.value.map((d: iStats) => {
                        d.date = new Date(d.intervalTo*1000)
                        for (const i in d.byThread) {
                            Object.assign(d, {['thread'+(i)]: d.byThread[i]})
                        }
                        return d
                    });
                    break;
                case 'newThreadsStat':
                    dataProvider = data.value;
                    dataProvider.date = new Date(dataProvider.intervalTo*1000)
                    for (const i in dataProvider.byThread) {
                        dataProvider['thread'+(i)] = dataProvider.byThread[i]
                    }
                    // console.log(dataProvider)
                    state.newThreadsStat = dataProvider
                    break;
                case 'settingSavedFalse':
                    state.showPreloader = false;
                    break;
                case 'historyQueueData':
                case 'immediateQueueData':
                case 'plannedQueueData':
                    data.value.map((item: any) => {
                        if (typeof item.output !== 'undefined') {
                            item.longOutput = item.output;
                            item.output = item.output.substring(0, 120);
                        }
                        if (typeof item.finished !== 'undefined') {
                            if (typeof item.started !== 'undefined') {
                                item.duration = Math.round((item.finished - item.started)*10)/10 + ' s'
                            }

                            item.finished = moment(item.finished * 1000).format('D.M. H:mm:ss').replace(' ',"\u00A0")
                        }
                    })

                    state.listItems = data.value;
                    break;
            }
        }
    },
    actions: {
        emitData(context, data) {
            context.commit('emitData', data)
        },
        server(context, hostname) {
            context.commit('server', hostname)
        },
        invalidateChart(context, value) {
            context.commit('invalidateChart', value)
        },
        colors(context, value) {
            context.commit('colors', value)
        },
        showPreloader(context, value) {
            context.commit('showPreloader', value)
        }
    },
    getters: {
        historyCount: state => {
            return state.historyCounter
        },
        threadsCount: state => {
            return state.threadsCounter
        },
        threads: state => {
            return state.threads
        },
        plannedCount: state => {
            return state.plannedCounter
        },
        waitingCount: state => {
            return state.waitingCounter
        },
        runningJobsList: state => {
            return state.runningJobsList
        },
        threadsStats: state => {
            return state.threadsStats
        },
        newThreadsStat: state => {
            return state.newThreadsStat
        },
        invalidateChart: state => {
            return state.invalidateChart
        },
        colors: state => {
            return state.colors
        },
        showPreloader: state => {
            return state.showPreloader
        }
    }
});