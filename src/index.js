class TimeFormat {

  constructor({ options = {} }) {
    this.options = options;
    this.keys = ('keys' in options) ? options.keys : { time: 'time_format', chronometer: 'chronometer_format', date: 'date_format' } 
    this.times = { time: '00:00:00', chronometer: 0 };
    this.interval = null;
  }

  start() {
    this.getDataStorage();
    this.interval = setInterval(() => {
        this.times.chronometer += 1;
        this.times.time = this.timeFormat(this.times.chronometer);
        this.save(this.times.time, this.times.chronometer);
    }, 1000);
  }

  pause() {
    this.interval.clearInterval();
  }

  reset() {
    this.times.time = '00:00:00';
    this.times.chronometer = 0;
  }

  checkDate() {
    const { date } = this.keys;
    // Get date from storage
    const saved = this.storage({ key: date });
    // Get the Date in 00:00:00 and 23:59:59
    const { first, last } = { first: new Date().setHours(0,0,0,0), last: new Date().setHours(23,59,59,999) };
    // Date get from localStorage
    const recordedDate = new Date(saved);
    // Validate the date is between 00:00:00.00 and 23:59:59.999
    return (first.getTime() >= recordedDate.getTime() <= last.getTime())
  }

  storage({read = true, value, key}) {
    /*
    * Function for get data from localStorage dynamically
    *
    * @params read - Boolean
    * @params value - String
    * @params key - String
    */
    if (!read && key in this.keys) this.times[key] = localStorage.setItem(this.keys[key], value);
    else {
      const value = localStorage.getItem(this.keys[key]);
      this.times[key] = (this.constructor.isNumber(value)) ? Number(value) : value;
    }
    return this.times;
  }

  getDataStorage() {
    Object.keys(this.keys).map(key => this.storage({key}));
  }

  save(Time = '', Chronometer = '') { 
    const { time, chronometer } = this.keys;
    localStorage.setItem(time, Time);
    localStorage.setItem(chronometer, Chronometer);
  }

  timeFormat(time) {
    // Time is in seconds
    time = time || 0;
    let seconds = time % 60;
    let minutes = (time / 60) % 60;
    const hours = (time / 60) / 60;
  
    const numberToString = (value) => {
      value = Math.trunc(value);
      return (value < 10) ? `0${value}` : value;
    };
  
    seconds = (seconds < 60) ? seconds : 0;
    minutes = (minutes < 60) ? minutes : 0;
    // Return in object format
    return `${numberToString(hours)}:${numberToString(minutes)}:${numberToString(seconds)}`;
  };

  static isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 

  _debug(type, ...args) {
    const { debug } = this.options;
    if (debug) console[type](...args);
  }

}

module.exports = TimeFormat;
