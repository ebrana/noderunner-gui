export const formatter =  {
    methods: {
        humanDate: (timestamp: number) => {
            const date = new Date(timestamp * 1000)
            const hours = date.getHours();
            const minutes = "0" + date.getMinutes();
            const seconds = "0" + date.getSeconds();
            const day = "0" + date.getDate();
            const month = "0" + (date.getMonth() + 1);
            const year = date.getFullYear();

            return day.substr(-2) + '. ' + month.substr(-2) + '. ' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        },
        humanDateWithoutYear: (timestamp: number) => {
            const date = new Date(timestamp * 1000)
            const hours = date.getHours();
            const minutes = "0" + date.getMinutes();
            const seconds = "0" + date.getSeconds();
            const day = "0" + date.getDate();
            const month = "0" + (date.getMonth() + 1);

            return day.substr(-2) + '. ' + month.substr(-2) + '. ' + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        },
        duration: (finished: number, started: number) => {
            return Math.round((finished - started)*10)/10 + ' s'
        }
    }
}