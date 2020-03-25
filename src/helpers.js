export const makemonth = month => {
  const returnMonth = months.findIndex(e =>
    e.name.toLowerCase().includes(month.toLowerCase())
  );
  return pad(returnMonth + 1, 2);
};

export function pad(num, size) {
  var s = "000000000" + num;
  return s.substr(s.length - size);
}

const months = [
  {
    abbreviation: "Jan",
    name: "January"
  },
  {
    abbreviation: "Feb",
    name: "February"
  },
  {
    abbreviation: "Mar",
    name: "March"
  },
  {
    abbreviation: "Apr",
    name: "April"
  },
  {
    abbreviation: "May",
    name: "May"
  },
  {
    abbreviation: "Jun",
    name: "June"
  },
  {
    abbreviation: "Jul",
    name: "July"
  },
  {
    abbreviation: "Aug",
    name: "August"
  },
  {
    abbreviation: "Sep",
    name: "September"
  },
  {
    abbreviation: "Oct",
    name: "October"
  },
  {
    abbreviation: "Nov",
    name: "November"
  },
  {
    abbreviation: "Dec",
    name: "December"
  }
];
