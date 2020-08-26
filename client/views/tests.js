module.exports = {
  nameTests: [
    function (text) {
      if (/^[0-9]+/.test(text)) {
        return "Field cannot start with a number. Start with letter or underscore." 
      }
    },
    function (text) {
      if (!/^[a-zA-Z0-9_]+$/.test(text)) {
        return "Invalid characters. Please only use letters, numbers, or underscores."
      }
    },
    // function (text) {
    //   if(this.parent.model && this.parent.model.collection){
    //     var isDuplicate = this.parent.model.collection.some(function (m) { return m.name === text && this.parent.model !== m;
    //     }, this);
    //     if (isDuplicate) {
    //       return "No duplicate entries."
    //     }
    //   }
    // },
  ],
  valueTests: [
    function (value) {
      if (isNaN(Number(value))) {
        return "Must be a number."
      }
    },
    function (value) {
      if (Number(value) < 0) {
        return "Must be non-negative."
      }
    },
  ],
}